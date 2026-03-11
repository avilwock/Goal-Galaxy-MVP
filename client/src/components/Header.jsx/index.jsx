import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import Auth from '../../utils/auth';

const Header =() => {
    // const navigate = useNavigate();


return (
    <header>
        <div>
            <Link to="/"></Link>
            <nav>
                <Link to="/">Home</Link>
            </nav>
        </div>
    </header>
)
}

export default Header;