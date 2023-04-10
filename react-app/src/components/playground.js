function countdown(timezone) {
    const date = new Date("Sat, 09 Apr 2023 00:00:00 GMT") ; //todo.due_date
    const dateString = date.toISOString().substring(0, 10);
    const targetDate = new Date(`${dateString}T23:59:59`)
    const targetTime = new Date(targetDate).getTime();
    const nowTime = new Date().getTime();
    const remainingTime = targetTime - nowTime;
    console.log(remainingTime)
  
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
  
    console.log(`${days}:${hours}:${minutes}:${seconds}`);
  }

//   countdown("America/Denver"); // output: 4 days, 8 hours, 12 minutes, 10 seconds remaining until 04/12/2023 at 11:59:59pm in America/Denver timezone
  countdown("America/New_York")
