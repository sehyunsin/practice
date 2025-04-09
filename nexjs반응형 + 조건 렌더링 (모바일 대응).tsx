import { useEffect, useState } from 'react';

export default function ResponsiveComponent() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div>
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </div>
  );
}

function MobileNav() {
  return <div>📱 모바일 메뉴</div>;
}

function DesktopNav() {
  return <div>💻 데스크탑 메뉴</div>;
}
