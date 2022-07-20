const BaseLayout = (props) => {
  const {
    className,
    children
  } = props;
  return (
    <main className={className} style={{ position: "relative" }}>
      {children}
    </main>
  );
};

export default BaseLayout;
