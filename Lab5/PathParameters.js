export default function PathParameters(app) {
  const add = (req, res) => {
    const { a, b } = req.params;
    const sum = parseInt(a) + parseInt(b);
    res.send(sum.toString());
  };

  const substract = (req, res) => {
    const { a, b } = req.params;
    const substraction = parseInt(a) - parseInt(b);
    res.send(substraction.toString());
  };

  const divide = (req, res) => {
    const { a, b } = req.params;
    const division = parseInt(a) / parseInt(b);
    res.send(division.toString());
  };

  const multiply = (req, res) => {
    const { a, b } = req.params;
    const multiplication = parseInt(a) * parseInt(b);
    res.send(multiplication.toString());
  };

  app.get("/lab5/add/:a/:b", add);
  app.get("/lab5/subtract/:a/:b", substract);
  app.get("/lab5/divide/:a/:b", divide);
  app.get("/lab5/multiply/:a/:b", multiply);
}
