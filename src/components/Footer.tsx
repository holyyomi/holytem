export default function Footer() {
  return (
    <footer className="border-t py-8 text-sm text-gray-600">
      <div className="mx-auto max-w-6xl px-4 space-y-2">
        <p>
          ※ 일부 링크는 제휴(파트너) 링크일 수 있으며, 구매 시 수수료를 받을 수
          있습니다. 이용자에게 추가 비용은 없습니다.
        </p>
        <div className="flex gap-4">
          <a href="/terms">약관</a>
          <a href="/privacy">개인정보처리방침</a>
          <a href="mailto:holyyomi@naver.com">광고·제휴 문의</a>
        </div>
        <div>© {new Date().getFullYear()} HolyTem</div>
      </div>
    </footer>
  );
}
