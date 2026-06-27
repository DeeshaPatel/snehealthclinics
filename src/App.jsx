import "./App.css";

export default function App() {
  return (
    <div className="container">
      <div className="card">


        <h1>SNE Health Clinic</h1>

        <h2>Your Health. Our Priority.</h2>

        <p>
          We are creating a modern healthcare experience for our patients.
          Our new website will soon allow you to book appointments, access
          healthcare services, and stay connected with our clinic.
        </p>

        <div className="countdown">
          <div>
            <span>✔</span>
            <small>Family Medicine</small>
          </div>

          <div>
            <span>✔</span>
            <small>Walk-In Clinic</small>
          </div>

          <div>
            <span>✔</span>
            <small>Virtual Care</small>
          </div>
        </div>

        <div className="footer">
          📍 15-247 Centennial Pkwy N, Hamilton, Ontario &nbsp; 
        </div>

      </div>
    </div>
  );
}