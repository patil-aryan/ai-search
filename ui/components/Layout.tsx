const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="lg:pl-64 bg-gradient-to-br from-[#0A0A0A] via-[#0f1419] to-[#0A0A0A] min-h-screen">
      <div className="max-w-screen-lg lg:mx-auto mx-4">{children}</div>
    </main>
  );
};

export default Layout;
