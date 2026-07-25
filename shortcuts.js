window.BAROKI_SHORTCUTS = [
  { id: "undo", title: "실행 취소", description: "방금 한 작업을 한 단계 이전으로 되돌려요.", category: "basic", categoryLabel: "기본 조작", windows: ["Ctrl", "Z"], mac: ["⌘", "Z"], keywords: "undo 실수 되돌리기 이전 취소", icon: "rotate-ccw", tone: "green", priority: 1 },
  { id: "save", title: "저장하기", description: "작성 중인 문서나 파일의 변경 내용을 저장해요.", category: "file", categoryLabel: "파일", windows: ["Ctrl", "S"], mac: ["⌘", "S"], keywords: "save 문서 파일 보관 저장", icon: "save", tone: "orange", priority: 2 },
  { id: "select-all", title: "모두 선택", description: "화면의 글자나 파일을 한 번에 모두 선택해요.", category: "basic", categoryLabel: "기본 조작", windows: ["Ctrl", "A"], mac: ["⌘", "A"], keywords: "select all 전체 모두 선택", icon: "mouse-pointer-2", tone: "pink", priority: 3 },
  { id: "screenshot", title: "화면 캡처", description: "화면에서 필요한 부분만 골라 사진으로 저장해요.", category: "screen", categoryLabel: "화면·보안", windows: ["Win", "Shift", "S"], mac: ["⌘", "Shift", "4"], keywords: "screenshot 스크린샷 캡쳐 캡처 사진 화면", icon: "scan-line", tone: "yellow", priority: 4 },
  { id: "find", title: "화면에서 찾기", description: "문서나 인터넷 화면에서 원하는 단어를 찾아요.", category: "writing", categoryLabel: "글쓰기", windows: ["Ctrl", "F"], mac: ["⌘", "F"], keywords: "find 검색 단어 문서 찾기", icon: "search", tone: "teal", priority: 5 },
  { id: "close-tab", title: "현재 탭 닫기", description: "지금 보고 있는 인터넷 탭만 닫아요.", category: "browser", categoryLabel: "인터넷", windows: ["Ctrl", "W"], mac: ["⌘", "W"], keywords: "close tab 인터넷 탭 창 닫기", icon: "square-x", tone: "red", priority: 6 },
  { id: "refresh", title: "새로고침", description: "현재 인터넷 페이지의 최신 내용을 다시 불러와요.", category: "browser", categoryLabel: "인터넷", windows: ["Ctrl", "R"], mac: ["⌘", "R"], keywords: "refresh reload 인터넷 페이지 새로 고침", icon: "refresh-cw", tone: "blue", priority: 7 },
  { id: "close-app", title: "프로그램 닫기", description: "현재 사용 중인 프로그램 창을 완전히 닫아요.", category: "screen", categoryLabel: "화면·보안", windows: ["Alt", "F4"], mac: ["⌘", "Q"], keywords: "close app 프로그램 종료 닫기 창", icon: "power", tone: "red", priority: 8 },
  { id: "copy", title: "복사하기", description: "선택한 글자, 사진, 파일을 그대로 복사해요.", category: "basic", categoryLabel: "기본 조작", windows: ["Ctrl", "C"], mac: ["⌘", "C"], keywords: "copy 글자 사진 파일 문서 복사", icon: "copy", tone: "blue", priority: 9 },
  { id: "paste", title: "붙여넣기", description: "복사한 내용을 원하는 위치에 넣어요.", category: "basic", categoryLabel: "기본 조작", windows: ["Ctrl", "V"], mac: ["⌘", "V"], keywords: "paste 복사 넣기 붙여넣기", icon: "clipboard", tone: "purple", priority: 10 },
  { id: "new-tab", title: "새 인터넷 탭 열기", description: "현재 인터넷 창에 새로운 탭을 열어요.", category: "browser", categoryLabel: "인터넷", windows: ["Ctrl", "T"], mac: ["⌘", "T"], keywords: "new tab 인터넷 탭 새 창 열기", icon: "square-plus", tone: "blue", priority: 11 },
  { id: "restore-tab", title: "닫은 탭 다시 열기", description: "실수로 닫은 인터넷 탭을 다시 불러와요.", category: "browser", categoryLabel: "인터넷", windows: ["Ctrl", "Shift", "T"], mac: ["⌘", "Shift", "T"], keywords: "restore tab 인터넷 복구 닫은 탭 다시 열기", icon: "history", tone: "purple", priority: 12 },
  { id: "zoom-in", title: "화면과 글자 크게", description: "인터넷 화면의 글자와 사진을 더 크게 보여요.", category: "browser", categoryLabel: "인터넷", windows: ["Ctrl", "+"], mac: ["⌘", "+"], keywords: "zoom in 확대 글자 크게 화면", icon: "zoom-in", tone: "orange", priority: 13 },
  { id: "zoom-out", title: "화면과 글자 작게", description: "커진 인터넷 화면을 다시 작게 줄여요.", category: "browser", categoryLabel: "인터넷", windows: ["Ctrl", "-"], mac: ["⌘", "-"], keywords: "zoom out 축소 글자 작게 화면", icon: "zoom-out", tone: "teal", priority: 14 },
  { id: "switch-window", title: "열린 창 바꾸기", description: "열려 있는 프로그램 사이를 빠르게 이동해요.", category: "screen", categoryLabel: "화면·보안", windows: ["Alt", "Tab"], mac: ["⌘", "Tab"], keywords: "switch window 프로그램 창 전환 이동", icon: "panels-top-left", tone: "purple", priority: 15 },
  { id: "cut", title: "잘라내기", description: "선택한 내용을 현재 위치에서 빼서 다른 곳으로 옮겨요.", category: "basic", categoryLabel: "기본 조작", windows: ["Ctrl", "X"], mac: ["⌘", "X"], keywords: "cut 이동 옮기기 잘라내기", icon: "scissors", tone: "pink", priority: 16 },
  { id: "redo", title: "다시 실행", description: "실행 취소했던 작업을 다시 원래대로 돌려요.", category: "basic", categoryLabel: "기본 조작", windows: ["Ctrl", "Y"], mac: ["⌘", "Shift", "Z"], keywords: "redo 다시 실행 되돌리기", icon: "rotate-cw", tone: "blue", priority: 17 },
  { id: "print", title: "인쇄하기", description: "현재 문서나 인터넷 화면을 프린터로 출력해요.", category: "file", categoryLabel: "파일", windows: ["Ctrl", "P"], mac: ["⌘", "P"], keywords: "print 프린터 출력 인쇄", icon: "printer", tone: "purple", priority: 18 },
  { id: "lock", title: "컴퓨터 잠그기", description: "자리를 비울 때 다른 사람이 보지 못하도록 잠가요.", category: "screen", categoryLabel: "화면·보안", windows: ["Win", "L"], mac: ["Control", "⌘", "Q"], keywords: "lock 보안 잠금 자리 비움 컴퓨터", icon: "lock", tone: "green", priority: 19 },
  { id: "rename", title: "파일 이름 바꾸기", description: "선택한 파일이나 폴더의 이름을 새로 정해요.", category: "file", categoryLabel: "파일", windows: ["F2"], mac: ["Return"], keywords: "rename 파일 폴더 이름 변경", icon: "pencil", tone: "orange", priority: 20 },
  { id: "desktop", title: "바탕화면 바로 보기", description: "열린 창을 잠시 숨기고 바탕화면을 보여요.", category: "screen", categoryLabel: "화면·보안", windows: ["Win", "D"], mac: ["Fn", "F11"], keywords: "desktop 바탕 화면 창 숨기기", icon: "monitor", tone: "teal", priority: 21 },
  { id: "new-doc", title: "새 문서 만들기", description: "사용 중인 프로그램에서 새 문서나 새 창을 열어요.", category: "writing", categoryLabel: "글쓰기", windows: ["Ctrl", "N"], mac: ["⌘", "N"], keywords: "new 새 파일 문서 창 만들기", icon: "file-plus", tone: "yellow", priority: 22 },
  { id: "bold", title: "글자 굵게 만들기", description: "선택한 글자를 굵게 표시해 더 눈에 띄게 해요.", category: "writing", categoryLabel: "글쓰기", windows: ["Ctrl", "B"], mac: ["⌘", "B"], keywords: "bold 굵은 글씨 글자 강조", icon: "bold", tone: "pink", priority: 23 },
  { id: "help", title: "프로그램 도움말 열기", description: "사용 중인 프로그램의 도움말 화면을 열어요.", category: "basic", categoryLabel: "기본 조작", windows: ["F1"], mac: ["⌘", "?"], keywords: "help 설명 안내 도움말", icon: "circle-help", tone: "blue", priority: 24 },
  { id: "address-bar", title: "주소창으로 바로 이동", description: "마우스를 쓰지 않고 인터넷 주소창을 바로 선택해요.", category: "browser", categoryLabel: "인터넷", windows: ["Ctrl", "L"], mac: ["⌘", "L"], keywords: "주소창 url 인터넷 검색 이동 address bar", icon: "link", tone: "blue", priority: 25 },
  { id: "plain-paste", title: "글자 모양 없이 붙여넣기", description: "지원하는 프로그램에서 색상과 글꼴을 빼고 내용만 붙여넣어요.", category: "writing", categoryLabel: "글쓰기", windows: ["Ctrl", "Shift", "V"], mac: ["Option", "Shift", "⌘", "V"], keywords: "서식 없이 붙여넣기 글꼴 색상 제거 plain text paste match style", icon: "clipboard-paste", tone: "purple", priority: 26 },
  { id: "emoji", title: "이모지 입력창 열기", description: "웃는 얼굴과 기호를 고를 수 있는 입력창을 바로 열어요.", category: "writing", categoryLabel: "글쓰기", windows: ["Win", "."], mac: ["Control", "⌘", "Space"], keywords: "이모지 이모티콘 기호 emoji symbols", icon: "smile", tone: "yellow", priority: 27 },
  { id: "new-folder", title: "새 폴더 만들기", description: "파일을 정리할 새 폴더를 현재 위치에 바로 만들어요.", category: "file", categoryLabel: "파일", windows: ["Ctrl", "Shift", "N"], mac: ["Shift", "⌘", "N"], keywords: "새 폴더 만들기 파일 정리 folder", icon: "folder-plus", tone: "orange", priority: 28 },
  { id: "force-quit", title: "멈춘 프로그램 관리", description: "응답하지 않는 프로그램을 찾아 종료할 수 있는 화면을 열어요.", category: "screen", categoryLabel: "화면·보안", windows: ["Ctrl", "Shift", "Esc"], mac: ["Option", "⌘", "Esc"], keywords: "작업 관리자 강제 종료 멈춘 프로그램 task manager force quit", icon: "activity", tone: "red", priority: 29 },
  { id: "fullscreen", title: "전체 화면 켜고 끄기", description: "지원하는 앱이나 인터넷 화면을 꽉 차게 보거나 원래대로 돌아와요.", category: "screen", categoryLabel: "화면·보안", windows: ["F11"], mac: ["Control", "⌘", "F"], keywords: "전체 화면 풀스크린 fullscreen 켜기 끄기", icon: "maximize-2", tone: "teal", priority: 30 }
].sort((a, b) => a.priority - b.priority);

window.BAROKI_KEYBOARD_LAYOUTS = {
  windows: [
    ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "+", "Backspace"],
    ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "?", "Shift"],
    ["Ctrl", "Win", "Alt", "Space", "Alt", "Win", "Menu", "Ctrl"]
  ],
  mac: [
    ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "+", "Delete"],
    ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Return"],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "?", "Shift"],
    ["Fn", "Control", "Option", "Command", "Space", "Command", "Option", "Control"]
  ]
};
