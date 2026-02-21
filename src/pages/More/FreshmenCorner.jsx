import LinkButton from "../../components/LinkButton";
import "../Resources/Resources.scss";

export default function FreshMenCorner() {
  return (
    <div className="resource-page">
      <header className="resource-hero">
        <div className="title">
          <h1>Welcome, Class of 2027!</h1>
        </div>
      </header>
      <div className="resource-content">
        <div className="freshmen-corner">
          <div className="freshmen-corner__card">
            <h3 className="freshmen-corner__title">Virtual Tour of Lowell</h3>
            <LinkButton to="https://docs.google.com/document/d/1UVpp4I76UDjqJkYXNb01JueIAPk6tvpNC2a5KZwHOU0/edit?tab=t.0">
              Open tour
            </LinkButton>
          </div>
          <div className="freshmen-corner__card">
            <h3 className="freshmen-corner__title">Master Registry List</h3>
            <LinkButton
              to="https://docs.google.com/spreadsheets/d/1A-_2bJtMrByR2uPgT4uAyXeEx3Q6IYwWzZ-YuWLg65U/edit?gid=225032051#gid=225032051"
            >
              View registry
            </LinkButton>
          </div>
          <div className="freshmen-corner__card">
            <h3 className="freshmen-corner__title">Class Instagram</h3>
            <LinkButton to="https://www.instagram.com/lowell2027board">
              @lowell2027board
            </LinkButton>
          </div>
          <div className="freshmen-corner__card">
            <h3 className="freshmen-corner__title">Class Board Candidates</h3>
            <LinkButton to="/Elections" noTarget>
              View elections
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
