벨르뮤 청주본점 / 개선 배포본 / 2026-10-03
대표 주소: https://cheongjueyebrow.pages.dev/

1. ZIP 압축을 풀고 내용물 전체를 기존 GitHub 저장소 루트에 덮어쓰세요.
   index.html, _worker.js, assets, images, source가 루트 바로 아래에 있어야 합니다.
   ZIP 파일 자체 또는 상위 폴더를 업로드하지 마세요.
2. 기존 Cloudflare Pages 프로젝트의 Git 연결을 그대로 사용하세요.
   프레임워크: None / 빌드 명령: node source/build.mjs / 빌드 출력: .
   루트 디렉터리: 저장소 루트 (별도 하위 폴더 없음).
   Node.js 20 이상. 외부 패키지 설치가 필요하지 않습니다.
   이미 생성된 HTML을 포함하므로 빌드 없이 배포해도 같은 화면입니다.
3. GitHub 커밋 후 Cloudflare Pages의 배포 성공을 확인하세요.
4. 아래 주소를 직접 열어 확인하세요.
   / /brow-design.html /consultation-process.html /portfolio-guide.html
   /faq-care.html /visit-location.html /rss.xml /sitemap.xml
   /naver38f30a1e178ab296c7f5ea2a4e36e27e.html
   존재하지 않는 /this-page-does-not-exist 는 HTTP 404여야 합니다.

기존 SEO 보존
- 기존 6페이지 title, description, og:title, og:description 태그 원문 보존.
- 기존 canonical 및 6개 페이지 주소, 전화, 카카오톡, Instagram, 지도 보존.
- 네이버 인증 파일의 파일명/내용 보존. 원본 사진 바이트 보존.
- Cloudflare의 기본 .html 정리 동작과 기존 canonical의 충돌을 피하기 위해
  _worker.js가 기존 .html 주소를 200으로 제공하고 확장자 없는 주소를 301 연결합니다.
- _worker.js는 Cloudflare Pages Advanced Mode입니다. Git 연동 배포에 포함하세요.
  기존 저장소에 별도 Functions/Worker가 있다면 이 ZIP과 병합 전에 확인해야 합니다.
  첨부 원본에는 그러한 설정이 없었습니다.
- Cloudflare 대시보드의 기존 리다이렉트 규칙은 제공받지 않았으며 별도 확인 대상입니다.

원본 ZIP에 있던 deploy-check.html은 제작 점검 페이지이므로 개선본에 포함하지 않았습니다.
기존 저장소에 남아 있어도 Worker의 공개 허용 목록 밖이므로 404 처리됩니다.

자료 수정: docs/MAINTENANCE.md
변경 내용과 미검증 사항: docs/VALIDATION.md
URL 목록: docs/page-urls.txt / 카드 매핑: docs/carousel-mapping.csv
외부 도메인의 계정 소유권·사진 권리·검색 노출은 기술 검사와 별도입니다.
실제 Cloudflare 배포와 서치어드바이저 제출은 이번 작업에서 실행하지 않았습니다.
