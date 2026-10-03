# 수정 안내

공통 데이터는 `source/data/site.json`에서 관리합니다. `site`는 업체 식별 정보와 연락처, `carousel.items`는 대표 안내 목록, `pages`는 URL과 메타정보입니다. 기존 title·description은 변경 금지 대상으로 잠겨 있습니다.

수정 후 저장소 루트에서 `npm run build`와 `npm run check`를 실행하세요. Python과 외부 npm 의존성은 없습니다. 생성된 HTML까지 함께 커밋하면 빌드 명령 없는 배포도 가능합니다. Cloudflare에서 `node source/build.mjs`를 실행하면 데이터 수정이 자동 반영됩니다.

- 카드 이름·이미지·설명·순서는 `carousel.items`에서 변경합니다. `publish: false`는 메인 카드와 ItemList에서 동시에 제외합니다. 상세페이지를 삭제하거나 noindex로 바꾸는 옵션은 아닙니다.
- 현재는 실제로 제공된 내용에 맞춰 디자인·상담·포트폴리오 안내·FAQ·매장 안내 5개를 사용합니다. 이를 서로 다른 5개 시술 서비스라고 표시하지 않습니다.
- 페이지 내용은 `source/templates/각파일.html`, 공통 스타일과 동작은 `assets/site.css`, `assets/site.js`입니다. `{{...}}`는 빌드 시 채워지는 내부 토큰이며 최종 HTML에는 남지 않습니다.
- FAQ 질문과 답변은 `source/build.mjs`의 `faq` 배열에서 수정합니다. 메인과 FAQ 본문, FAQPage에 함께 반영됩니다.
- 연락처는 `site` 데이터에서 수정합니다. 업체 식별 정보·주소가 바뀌면 템플릿의 위치 설명, 지도 iframe 목적지, 해당 페이지 메타정보도 별도로 검토해야 합니다. 현 요청에서는 메타정보를 잠갔으므로 자동 변경하지 않습니다.
- 현재 페이지를 새로 추가하려면 템플릿과 `pages` 항목을 함께 등록하고 대표 이미지 치수를 `image-dimensions.json`에 넣습니다. 원본 이미지 권리와 실제 내용이 확보된 뒤 추가하세요. 새 페이지 메타태그 원문을 `protected-meta.json`에 등록해야 검수할 수 있습니다.
- `modified`는 실제 내용 수정 날짜입니다. 단순 재배포 때 날짜를 바꾸지 마세요. RSS 발행일은 제공된 원본 날짜를 유지합니다. 새 글이 있을 때만 `source/data/rss.xml`을 갱신하세요.
- 후기 원문, 사용 허락, 사례별 배경·과정이 제공되지 않아 가상 후기나 사례 상세페이지를 추가하지 않았습니다. 실제 자료가 확보되면 안정적인 URL을 가진 상세페이지로 확장할 수 있습니다.
- 확인되지 않은 가격, 영업시간, 주차 조건, 담당자 경력, 네이버 예약 링크는 생성하지 않았습니다. 기존 전화·카카오톡 상담을 이용합니다.
- 사진은 원본 바이트를 보존하고 화면에서 비율에 맞춰 표시합니다. 카드에는 `object-fit: contain`을 적용해 잘림을 방지했습니다.

`_worker.js`는 빌드 결과입니다. 라우팅 수정은 `source/worker-template.js`에서 수행하세요. 공개 페이지·정적 자산만 제공하며 source, docs, package.json은 웹에서 404로 응답합니다. Pages Functions 사용량은 Cloudflare 계정의 기존 한도를 따릅니다.

배포 참고: https://developers.cloudflare.com/pages/functions/advanced-mode/
Pages 기본 URL 처리: https://developers.cloudflare.com/pages/configuration/serving-pages/
