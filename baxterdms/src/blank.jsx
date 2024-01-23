useEffect(() => {
    if (user) {
      // Assuming user.uid is the UID of the currently logged-in user
      const currentUserUID = user.uid;
  
      // Fetch the user data
      fetch(`http://localhost:8000/users?UID=${currentUserUID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          return response.json();
        })
        .then((userData) => {
          // Find the index of the user in the 'users' array
          const userIndex = userData.users.findIndex((u) => u.UID === currentUserUID);
  
          if (userIndex !== -1) {
            // Update the selectedTheme for the user
            userData.users[userIndex].selectedTheme = "newTheme"; // Replace "newTheme" with the actual theme you want to set
  
            // Perform a PATCH or PUT request to update the user data
            fetch(`http://localhost:8000/users/${currentUserUID}`, {
              method: "PATCH", // or "PUT" depending on your API
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Failed to update user data");
                }
                return response.json();
              })
              .then((updatedUserData) => {
                console.log("User data updated successfully:", updatedUserData);
              })
              .catch((error) => {
                console.error("Error updating user data:", error);
              });
          } else {
            console.error("User not found in the data");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [user]);