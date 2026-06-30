import { Link, useNavigate } from 'react-router-dom';

const Header = ({ setUser }) => {
  const navigate = useNavigate();

  const logout = (e) => {
    e.preventDefault();

    localStorage.removeItem('token');
    setUser(null);

    navigate('/');
  };

  const token = localStorage.getItem('token');

  return (
    <header className="header bg-info mb-4 py-3">
      <div className="container flex-column align-center text-center">

        <Link to="/">
          <h1 className="m-0" style={{ fontSize: '3rem' }}>
            Goal Planner
          </h1>
        </Link>

        <nav className="nav-links">

          <Link className="btn btn-lg btn-primary m-2" to="/">
            Home
          </Link>

          {token ? (
            <>
              <Link className="btn btn-lg btn-primary m-2" to="/goals">
                Goals
              </Link>

              <Link className="btn btn-lg btn-primary m-2" to="/tasks">
                Tasks
              </Link>

              <button
                className="btn btn-lg btn-light m-2"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-lg btn-primary m-2" to="/login">
                Login
              </Link>

              <Link className="btn btn-lg btn-light m-2" to="/signup">
                Signup
              </Link>
            </>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Header;