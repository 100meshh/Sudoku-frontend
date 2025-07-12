import React from "react";

const LoginRegister = ({
  usrname,
  setUsrname,
  pass,
  setPass,
  handleRegister,
  handleLogin,
  isLoggedIn,
  handleLogout,
  myDetails,
}) => {
  return (
    <>
      {!isLoggedIn ? (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-blue-800 font-bold mb-2">Login/Register</div>
          <input
            type="text"
            placeholder="Enter username"
            value={usrname}
            onChange={(event) => setUsrname(event.target.value)}
            className="w-full mb-2 px-3 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(event) => setPass(event.target.value)}
            className="w-full mb-2 px-3 py-2 border rounded"
          />
          <div className="flex gap-2">
            <button
              className="mybutton flex-1"
              onClick={handleRegister}
            >
              Register
            </button>
            <button
              className="mybutton flex-1"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-4">
          <ul className="mb-2">
            <li>Username: {myDetails.username}</li>
            <li>Score: {myDetails.Score}</li>
            <li>Games played: {myDetails.Games}</li>
          </ul>
          <button onClick={handleLogout} className="mybutton">
            Log out
          </button>
        </div>
      )}
    </>
  );
};

export default LoginRegister; 