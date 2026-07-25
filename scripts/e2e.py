import json
import os
import shutil
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
HTML = (DIST / "index.html").read_text(encoding="utf-8")
RESULTS = []
CONSOLE_ERRORS = []


def check(name, condition, detail=""):
    RESULTS.append({"name": name, "pass": bool(condition), "detail": str(detail)})
    if not condition:
        raise AssertionError(f"{name}: {detail}")


try:
    with sync_playwright() as p:
        candidates = [
            os.environ.get("CHROMIUM_PATH"),
            p.chromium.executable_path,
            shutil.which("chromium"),
            shutil.which("chromium-browser"),
            shutil.which("google-chrome"),
            shutil.which("google-chrome-stable"),
            "/usr/lib/chromium/chromium",
        ]
        executable = next((candidate for candidate in candidates if candidate and Path(candidate).exists()), None)
        if not executable:
            raise RuntimeError("Chromium 실행 파일을 찾지 못했습니다. CHROMIUM_PATH를 지정하세요.")
        browser = p.chromium.launch(headless=True, executable_path=executable)

        page = browser.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
        page.on("console", lambda msg: CONSOLE_ERRORS.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda error: CONSOLE_ERRORS.append(str(error)))
        page.set_default_timeout(10000)
        page.evaluate("""() => {
          const store = {};
          Object.defineProperty(window, 'localStorage', {
            configurable: true,
            value: {
              getItem: (key) => Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null,
              setItem: (key, value) => { store[key] = String(value); },
              removeItem: (key) => { delete store[key]; },
              clear: () => { Object.keys(store).forEach((key) => delete store[key]); }
            }
          });
        }""")
        page.set_content(HTML, wait_until="load")

        check("페이지 제목", page.title() == "바로키 | 컴퓨터 단축키", page.title())
        check("상단 제목 이모지 제거", page.locator("#featuredTitle").inner_text().strip() == "지금 가장 많이 쓰는 단축키")
        check("상단 설명 바로 배치", page.locator("#featuredTitle + p").count() == 1)
        check("하단 제목 이모지 제거", page.locator("#libraryTitle").inner_text().strip() == "알아두면 일이 빨라지는 단축키")
        check("단축키 데이터 30개", page.evaluate("window.__BAROKI__.shortcuts.length") == 30)
        check("해시태그 필터 6개", page.locator(".category-chip").count() == 6)
        check("카드별 저장 버튼", page.locator('[data-action="save"]').count() == 30)
        check("카드별 키보드 버튼", page.locator('[data-action="keyboard"]').count() == 30)
        check("카드별 크게 보기 버튼", page.locator('[data-action="large"]').count() == 30)
        check("초기 저장 영역 숨김", page.locator("#savedSection").is_hidden())
        page.locator('[data-shortcut-id="undo"] [data-action="save"]').click()
        page.wait_for_timeout(80)
        check("저장 영역 노출", page.locator("#savedSection").is_visible())
        check("저장한 카드 최상단 표시", page.locator('#savedGrid .shortcut-card[data-shortcut-id="undo"]').count() == 1)
        check("저장 상태 표시", page.locator('#savedGrid .shortcut-card[data-shortcut-id="undo"] [data-action="save"]').inner_text().strip() == "저장됨")
        stored = page.evaluate("localStorage.getItem('baroki-saved-shortcuts')")
        check("localStorage 영구 저장", 'undo' in stored, stored)

        persisted = browser.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
        persisted.evaluate("""(savedValue) => {
          const store = { 'baroki-saved-shortcuts': savedValue };
          Object.defineProperty(window, 'localStorage', {
            configurable: true,
            value: {
              getItem: (key) => Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null,
              setItem: (key, value) => { store[key] = String(value); },
              removeItem: (key) => { delete store[key]; },
              clear: () => { Object.keys(store).forEach((key) => delete store[key]); }
            }
          });
        }""", stored)
        persisted.set_content(HTML, wait_until="load")
        check("다시 방문해도 저장 유지", persisted.locator('#savedGrid .shortcut-card[data-shortcut-id="undo"]').count() == 1)
        persisted.close()
        page.evaluate("document.querySelector('[data-category=\"browser\"]').click()")
        page.wait_for_timeout(50)
        categories = page.locator("#shortcutGrid .shortcut-card").evaluate_all("els => els.map(e => window.__BAROKI__.shortcuts.find(s => s.id === e.dataset.shortcutId).category)")
        check("해시태그 카테고리 필터", bool(categories) and all(c == "browser" for c in categories), categories)
        check("선택 필터 활성화", page.locator('[data-category="browser"]').get_attribute("aria-pressed") == "true")

        page.evaluate("document.querySelector('[data-category=\"all\"]').click()")
        first_key = page.locator('[data-shortcut-id="save"] .keycap').first.inner_text()
        page.locator('[data-platform="mac"]').click()
        page.wait_for_timeout(50)
        mac_key = page.locator('[data-shortcut-id="save"] .keycap').first.inner_text()
        check("Windows/Mac 전환", first_key == "Ctrl" and mac_key == "⌘", f"{first_key} → {mac_key}")
        page.locator("#mainSearch").fill("복사")
        page.wait_for_timeout(50)
        search_titles = page.locator("#shortcutGrid h3").all_inner_texts()
        check("검색", "복사하기" in search_titles and "붙여넣기" in search_titles, search_titles)
        page.locator("#clearSearch").click()

        page.locator('[data-platform="windows"]').click()
        page.locator('#shortcutGrid [data-action="keyboard"]').first.click()
        page.locator("#keyboardModal").wait_for(state="visible")
        page.wait_for_timeout(1000)
        check("키보드 모달", page.locator("#keyboardModal").is_visible())
        check("키 위치 강조", page.locator("#keyboardVisual .is-lit").count() >= 1, page.locator("#keyboardVisual .is-lit").count())
        page.keyboard.press("Escape")
        page.wait_for_timeout(50)
        check("키보드 모달 ESC 닫기", page.locator("#keyboardModal").is_hidden())

        page.locator('#shortcutGrid [data-action="large"]').first.click()
        page.locator("#largeModal").wait_for(state="visible")
        check("크게 보기 모달", page.locator("#largeModal").is_visible())
        page.evaluate("document.getElementById('largeModal').click()")
        page.wait_for_timeout(50)
        check("크게 보기 바깥 클릭 닫기", page.locator("#largeModal").is_hidden())
        page.screenshot(path=str(ROOT / "baroki-desktop-final.png"), full_page=True)

        mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
        mobile.on("console", lambda msg: CONSOLE_ERRORS.append(f"mobile: {msg.text}") if msg.type == "error" else None)
        mobile.on("pageerror", lambda error: CONSOLE_ERRORS.append(f"mobile: {error}"))
        mobile.set_content(HTML, wait_until="load")
        check("모바일 Windows/Mac 전환 노출", mobile.locator(".segmented-control").is_visible())
        check("모바일 제목 설명 간격", mobile.locator("#featuredTitle + p").count() == 1)
        check("모바일 해시태그 필터 노출", mobile.locator(".category-filter").is_visible())
        check("모바일 1열 카드", mobile.locator("#featuredGrid .shortcut-card").first.bounding_box()["width"] > 330)
        overflow = mobile.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
        check("모바일 가로 넘침 없음", overflow, mobile.evaluate("[document.documentElement.scrollWidth, window.innerWidth]"))
        check("모바일 저장 버튼 노출", mobile.locator('[data-shortcut-id="undo"] [data-action="save"]').is_visible())
        mobile.screenshot(path=str(ROOT / "baroki-mobile-final.png"), full_page=True)
        browser.close()

    check("콘솔 오류 없음", len(CONSOLE_ERRORS) == 0, CONSOLE_ERRORS)
    payload = {"pass": True, "results": RESULTS, "consoleErrors": CONSOLE_ERRORS}
except Exception as error:
    payload = {"pass": False, "results": RESULTS, "consoleErrors": CONSOLE_ERRORS, "fatal": str(error)}
finally:
    (ROOT / "test-results.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

print(json.dumps(payload, ensure_ascii=False, indent=2))
raise SystemExit(0 if payload.get("pass") else 1)
