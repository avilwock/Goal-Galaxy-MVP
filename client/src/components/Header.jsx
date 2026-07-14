import { Link, useNavigate } from 'react-router-dom';

const Header = ({ setUser }) => {
  const navigate = useNavigate();

  const logout = (e) => {
    e.preventDefault();

    localStorage.removeItem('id_token');
    setUser(null);

    navigate('/');
    window.location.reload();
  };

  const token = localStorage.getItem('id_token');

  return (
    <header className="bg-sky-500 py-4 mb-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-4">

        <Link to="/">
          <h1 className="text-5xl font-bold text-white">
            Goal Planner
          </h1>
        </Link>

        <nav className="flex flex-wrap justify-center gap-3">

          <Link
            className="px-4 py-2 bg-white text-sky-600 font-semibold rounded-lg hover:bg-sky-100"
            to="/"
          >
            Home
          </Link>

          {token ? (
            <>
              <Link
                className="px-4 py-2 bg-white text-sky-600 font-semibold rounded-lg hover:bg-sky-100"
                to="/"
              >
                Goals
              </Link>

              <Link
                className="px-4 py-2 bg-white text-sky-600 font-semibold rounded-lg hover:bg-sky-100"
                to="/tasks"
              >
                Tasks
              </Link>

              <button
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="px-4 py-2 bg-white text-sky-600 font-semibold rounded-lg hover:bg-sky-100"
                to="/login"
              >
                Login
              </Link>

              <Link
                className="px-4 py-2 bg-white text-sky-600 font-semibold rounded-lg hover:bg-sky-100"
                to="/signup"
              >
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