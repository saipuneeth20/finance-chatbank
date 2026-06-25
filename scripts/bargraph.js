const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const data = [
  { income: 1200, expense: 800 },
  { income: 1000, expense: 700 },
  { income: 1400, expense: 900 },
  { income: 1300, expense: 1000 },
  { income: 1100, expense: 750 },
  { income: 1250, expense: 850 }
];

const container = document.getElementById("barChartContainer");
const labels = document.getElementById("xLabels");
container.innerHTML = "";
labels.innerHTML = "";

const maxVal = Math.max(...data.map(d => Math.max(d.income, d.expense)));
const chartHeight = 320;

data.forEach((entry, index) => {
  const group = document.createElement("div");
  group.className = "bar-group";

  const expenseBar = document.createElement("div");
  expenseBar.className = "bar expense";
  const expenseValue = document.createElement("span");
  expenseValue.className = "value";
  expenseValue.innerText = `₹${entry.expense}`;
  expenseBar.appendChild(expenseValue);

  const incomeBar = document.createElement("div");
  incomeBar.className = "bar income";
  const incomeValue = document.createElement("span");
  incomeValue.className = "value";
  incomeValue.innerText = `₹${entry.income}`;
  incomeBar.appendChild(incomeValue);

  group.appendChild(expenseBar);
  group.appendChild(incomeBar);
  container.appendChild(group);

  const label = document.createElement("div");
  label.className = "x-label";
  label.innerText = months[index];
  labels.appendChild(label);

  setTimeout(() => {
    expenseBar.style.height = `${(entry.expense / maxVal) * chartHeight}px`;
    incomeBar.style.height = `${(entry.income / maxVal) * chartHeight}px`;
  }, 100 * index);
});
// Add hover effect for bars
const bars = document.querySelectorAll(".bar"); 
bars.forEach(bar => {
  bar.addEventListener("mouseover", () => {
    bar.classList.add("hover");
  });
  bar.addEventListener("mouseout", () => {
    bar.classList.remove("hover");
  });
});