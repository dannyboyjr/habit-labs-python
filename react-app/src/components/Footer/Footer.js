import './Footer.css';
import Github from '../../assets/github.png'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-6">
          </div>
          <div className="col-sm-12 col-md-6">
            <ul className="social-icons">
              <li><a href="https://github.com/dannyboyjr/habit-labs-python" target="_blank" rel="noreferrer"><img src={Github} alt="Github" /></a></li>
              {/* <li>
                <Link to="/terms-and-conditions">Terms and Conditions</Link>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;