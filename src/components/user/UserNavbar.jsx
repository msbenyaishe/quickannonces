import { Link } from "react-router-dom";

export default function UserNavbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/publier">Publier</Link>
      <Link to="/connexion">Connexion</Link>
    </nav>
  );
}
