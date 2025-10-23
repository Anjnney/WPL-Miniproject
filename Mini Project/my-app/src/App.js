import React, { useState, useEffect, useRef } from "react";
import Login from "./Login"; // Import login component
import jumpingJackGif from "./assets/jumpingjack.gif";
import "./App.css";

const EXERCISES = [
  { id: "brisk_walking", name: "Brisk Walking", type: "timed", pointsPerUnit: 1, caloriesPerUnit: 4, unit: "minutes" },
  { id: "jogging", name: "Jogging", type: "timed", pointsPerUnit: 1.5, caloriesPerUnit: 8, unit: "minutes" },
  { id: "cycling", name: "Cycling", type: "timed", pointsPerUnit: 1.2, caloriesPerUnit: 7, unit: "minutes" },
  { id: "jumping_jacks", name: "Jumping Jacks", type: "timed", pointsPerUnit: 1.8, caloriesPerUnit: 10, unit: "minutes" },
  { id: "push_ups", name: "Push-ups", type: "quantity", pointsPerUnit: 0.5, caloriesPerUnit: 0.5, unit: "reps" },
  { id: "squats", name: "Squats", type: "quantity", pointsPerUnit: 0.4, caloriesPerUnit: 0.4, unit: "reps" },
  { id: "pull_ups", name: "Pull-ups", type: "quantity", pointsPerUnit: 2, caloriesPerUnit: 2, unit: "reps" },
  { id: "weightlifting", name: "Weightlifting", type: "timed", pointsPerUnit: 2, caloriesPerUnit: 12, unit: "minutes" },
  { id: "stretching", name: "Stretching", type: "timed", pointsPerUnit: 0.5, caloriesPerUnit: 2, unit: "minutes" },
  { id: "yoga_pilates", type: "timed", pointsPerUnit: 0.8, caloriesPerUnit: 4, unit: "minutes" },
];

const initialPlayers = [
  { id: 1, name: "PlayerOne", score: 120, avatar: "🚴" },
  { id: 2, name: "FitFriend", score: 95, avatar: "🏃" },
];

function App() {
  const [user, setUser] = useState(null); // Logged-in user
  const [players, setPlayers] = useState(initialPlayers);
  const [myScore, setMyScore] = useState(0);
  const [energyPoints, setEnergyPoints] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [socialMessage, setSocialMessage] = useState("");

  const [lastLoginDate, setLastLoginDate] = useState(null);
  const [exerciseCompletionStatus, setExerciseCompletionStatus] = useState({}); // { exerciseId: { completed: true, units: X } }
  const [activeTimer, setActiveTimer] = useState(null); // exerciseId of the active timer
  const [timerStartTime, setTimerStartTime] = useState(null);
  const [timerDuration, setTimerDuration] = useState(0); // in seconds
  const [quantityInputs, setQuantityInputs] = useState({}); // { exerciseId: value }
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [fitnessFact, setFitnessFact] = useState("");

  // Daily Reset Effect
  useEffect(() => {
    const today = new Date().toDateString();
    const storedLastLoginDate = localStorage.getItem("lastLoginDate");

    if (storedLastLoginDate !== today) {
      // It's a new day, reset everything
      setMyScore(0);
      setEnergyPoints(0);
      setCaloriesBurned(0);
      setExerciseCompletionStatus({});
      localStorage.setItem("lastLoginDate", today);
    } else {
      // Load state from localStorage if available (for persistent session within the same day)
      setMyScore(parseInt(localStorage.getItem("myScore") || "0"));
      setEnergyPoints(parseInt(localStorage.getItem("energyPoints") || "0"));
      setCaloriesBurned(parseInt(localStorage.getItem("caloriesBurned") || "0"));
      setExerciseCompletionStatus(JSON.parse(localStorage.getItem("exerciseCompletionStatus") || "{}"));
    }
    setLastLoginDate(today);
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem("myScore", myScore.toString());
    localStorage.setItem("energyPoints", energyPoints.toString());
    localStorage.setItem("caloriesBurned", caloriesBurned.toString());
    localStorage.setItem("exerciseCompletionStatus", JSON.stringify(exerciseCompletionStatus));
  }, [myScore, energyPoints, caloriesBurned, exerciseCompletionStatus]);

  // Timer Effect
  useEffect(() => {
    let interval;
    if (activeTimer && timerStartTime) {
      interval = setInterval(() => {
        setTimerDuration(Math.floor((Date.now() - timerStartTime) / 1000));
      }, 1000);
    } else if (!activeTimer) {
      setTimerDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeTimer, timerStartTime]);

  // Fetch Motivational Quote
  useEffect(() => {
    if (user) {
      fetch("https://zenquotes.io/api/random")
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            setMotivationalQuote(data[0].q + " - " + data[0].a);
          }
        })
        .catch((error) => console.error("Error fetching quote:", error));
    }
  }, [user]);

  const handleQuantityChange = (exerciseId, value) => {
    setQuantityInputs((prev) => ({ ...prev, [exerciseId]: value }));
  };

  const handleQuantityComplete = (exerciseId) => {
    const exercise = EXERCISES.find((ex) => ex.id === exerciseId);
    const quantity = parseInt(quantityInputs[exerciseId] || "0");

    if (quantity > 0 && exercise) {
      const points = quantity * exercise.pointsPerUnit;
      const calories = quantity * exercise.caloriesPerUnit;

      setMyScore((prev) => prev + points);
      setEnergyPoints((prev) => prev + points);
      setCaloriesBurned((prev) => prev + calories);
      setFeedback(`Logged ${quantity} ${exercise.unit} of ${exercise.name}! Earned ${points} points and burned ${calories} calories.`);
      setExerciseCompletionStatus((prev) => ({ ...prev, [exerciseId]: { completed: true, units: (prev[exerciseId]?.units || 0) + quantity } }));
      setQuantityInputs((prev) => ({ ...prev, [exerciseId]: "" })); // Clear input

      // Check for achievement (Centurion example)
      if (myScore + points > 100 && !achievements.includes("Centurion")) {
        setAchievements((a) => [...a, "Centurion"]);
      }
    }
  };

  const startTimer = (exerciseId) => {
    if (activeTimer) {
      setFeedback("Another timer is already running. Stop it first.");
      return;
    }
    setActiveTimer(exerciseId);
    setTimerStartTime(Date.now());
    setFeedback(`Timer started for ${EXERCISES.find(ex => ex.id === exerciseId).name}...`);
  };

  const stopTimer = (exerciseId) => {
    if (activeTimer !== exerciseId) {
      setFeedback("This timer is not active.");
      return;
    }
    const exercise = EXERCISES.find((ex) => ex.id === exerciseId);
    const durationInMinutes = Math.floor(timerDuration / 60);

    if (durationInMinutes > 0 && exercise) {
      const points = durationInMinutes * exercise.pointsPerUnit;
      const calories = durationInMinutes * exercise.caloriesPerUnit;

      setMyScore((prev) => prev + points);
      setEnergyPoints((prev) => prev + points);
      setCaloriesBurned((prev) => prev + calories);
      setFeedback(`Logged ${durationInMinutes} minutes of ${exercise.name}! Earned ${points} points and burned ${calories} calories.`);
      setExerciseCompletionStatus((prev) => ({ ...prev, [exerciseId]: { completed: true, units: (prev[exerciseId]?.units || 0) + durationInMinutes } }));
    } else {
      setFeedback("Timer ran for less than a minute. No points awarded.");
    }

    setActiveTimer(null);
    setTimerStartTime(null);
    setTimerDuration(0);
  };

  const fetchFitnessFact = () => {
    fetch("https://uselessfacts.jsph.pl/random.json?language=en")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.text) {
          setFitnessFact(data.text);
        }
      })
      .catch((error) => console.error("Error fetching fitness fact:", error));
  };

  if (!user) {
    return (
      <div className="App">
        <Login onLogin={setUser} />
      </div>
    );
  }

  const totalExercisesCompleted = Object.keys(exerciseCompletionStatus).length;

  return (
    <div className="App">
      <header className="app-header">
        <h1>FitPlay Multiplayer Fitness Game</h1>
        <div className="user-stats">
          <p>User: <span>{user}</span></p>
          <p>Score: <span>{myScore}</span> points</p>
          <p>Energy: <span>{energyPoints}</span> ⚡</p>
          <p>Calories: <span>{caloriesBurned}</span> kcal</p>
        </div>
        <button onClick={() => setUser(null)} className="sign-out-button">Sign Out</button>
        {motivationalQuote && <p className="motivational-quote-display">{motivationalQuote}</p>}
      </header>

      <div className="main-content-area">
        <section className="exercises-section">
          <h2>Exercises</h2>
          <div className="exercise-list">
            {EXERCISES.map((exercise) => (
              <div key={exercise.id} className="exercise-item">
                <h3>{exercise.name}</h3>
                {exercise.type === "quantity" ? (
                  <>
                    <input
                      type="number"
                      placeholder={`Enter ${exercise.unit}`}
                      value={quantityInputs[exercise.id] || ""}
                      onChange={(e) => handleQuantityChange(exercise.id, e.target.value)}
                      min="0"
                    />
                    <button
                      onClick={() => handleQuantityComplete(exercise.id)}
                      disabled={!quantityInputs[exercise.id] || exerciseCompletionStatus[exercise.id]?.completed}
                    >
                      Log {exercise.unit}
                    </button>
                  </>
                ) : (
                  <>
                    {activeTimer === exercise.id ? (
                      <>
                        <p>Duration: {Math.floor(timerDuration / 60)}m {timerDuration % 60}s</p>
                        <button onClick={() => stopTimer(exercise.id)}>Stop Timer</button>
                      </>
                    ) : (
                      <button
                        onClick={() => startTimer(exercise.id)}
                        disabled={activeTimer !== null || exerciseCompletionStatus[exercise.id]?.completed}
                      >
                        Start Timer
                      </button>
                    )}
                  </>
                )}
                {exerciseCompletionStatus[exercise.id]?.completed && (
                  <p className="completed-status">Completed! Units: {exerciseCompletionStatus[exercise.id].units}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="sidebar-sections">
          <section className="player-stats-section">
            <h2>Player Stats & Feedback</h2>
            <p>My Score: {myScore} points</p>
            <p>Energy Points: {energyPoints} ⚡</p>
            <p>Calories Burned: {caloriesBurned} kcal</p>
            <p>Exercises Completed Today: {totalExercisesCompleted}</p>
            {feedback && <p className="feedback-message">{feedback}</p>}
          </section>

          <section className="achievements-section">
            <h2>Achievements</h2>
            {achievements.length === 0 ? (
              <p>No achievements yet.</p>
            ) : (
              <ul>
                {achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="leaderboard-section">
            <h2>Multiplayer Leaderboard</h2>
            <ul>
              {players
                .sort((a, b) => b.score - a.score)
                .map((p) => (
                  <li key={p.id}>
                    {p.avatar} {p.name}: {p.score} points
                  </li>
                ))}
            </ul>
          </section>

          <section className="social-sharing-section">
            <h2>Social Sharing</h2>
            {socialMessage ? <p>{socialMessage}</p> : <p>No recent shares</p>}
            <button
              onClick={() => alert("Shared on social media: " + socialMessage)}
              disabled={!socialMessage}
              className="share-button"
            >
              Share
            </button>
          </section>
        </div>
        <section className="resting-facts-section">
          <h2>Resting Facts</h2>
          <button onClick={fetchFitnessFact}>Get a Fact</button>
          {fitnessFact && <p className="fitness-fact-display">{fitnessFact}</p>}
        </section>
      </div>
    </div>
  );
}

export default App;