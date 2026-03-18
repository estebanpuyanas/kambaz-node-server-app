export default function Hello(App) {
  const sayHello = (req, res) => {
    res.send("Life is good!");
  };

  const sayWelcome = (req, res) => {
    res.send("Welcome to Full Stack Development!");
  };

  App.get("/hello", sayHello);
  App.get("/", sayWelcome);
}
