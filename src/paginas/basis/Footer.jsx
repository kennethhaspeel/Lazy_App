const Footer = () => {
    const datum = new Date();
  return (
  <div className="Footer bg-body-tertiary">
    <p>&copy; {datum.getFullYear()} Kenneth Haspeel</p>
    </div>
  )
};

export default Footer;
