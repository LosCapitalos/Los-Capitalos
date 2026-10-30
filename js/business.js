
const careers = [
  ["Cargo Handler", "Start your career carrying cargo."],
  ["Warehouse Worker", "Work in warehouse operations."],
  ["Cashier", "Handle payments and daily sales."],
  ["Delivery Driver", "Deliver goods across the city."],
  ["Security Guard", "Protect businesses and properties."],
  ["Construction Worker", "Build your future from the ground up."],
  ["Factory Operator", "Manage factory production."],
  ["Forklift Operator", "Handle industrial transportation."],
  ["Truck Driver", "Transport goods across the country."],
  ["Taxi Driver", "Build your income on the road."],
  ["Mechanic", "Repair vehicles and grow your business."],
  ["Electrician", "Provide professional electrical services."],
  ["Plumber", "Build a profitable service business."],
  ["Restaurant Owner", "Manage your own restaurant."],
  ["Logistics Manager", "Control large-scale logistics operations."],
  ["Accountant", "Manage finances for major clients."],
  ["Real Estate Agent", "Enter the property market."],
  ["Business Consultant", "Help companies grow and succeed."],
  ["Lawyer", "Build a powerful legal career."],
  ["Architect", "Design major commercial projects."],
  ["Company Director", "Lead an established company."],
  ["Import & Export Manager", "Manage international trade."],
  ["Investment Analyst", "Analyze financial markets."],
  ["Stockbroker", "Trade stocks and manage investments."],
  ["Real Estate Investor", "Build a property portfolio."],
  ["Venture Capitalist", "Invest in promising companies."],
  ["Hedge Fund Manager", "Manage large investment portfolios."],
  ["Corporate Executive", "Control major corporate operations."],
  ["Millionaire Investor", "Build a million-dollar fortune."],
  ["Los Capitalos", "Reach the top of the business world."]
];

const careerData = careers.map((career, index) => {
  const price = 500 * Math.pow(3, index);

  const passiveIncome = Math.round(
    Math.pow(3, index * 0.74) * 100
  ) / 100;

  return {
    id: index + 1,
    title: career[0],
    description: career[1],
    price,
    passiveIncome,
    clickIncome: Math.max(1, Math.round(passiveIncome * 0.1))
  };
});

function formatCash(value) {
  if (window.formatMoney) {
    return window.formatMoney(value);
  }

  const units = [
    [1e15, "Qa"],
    [1e12, "T"],
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"]
  ];

  for (const [limit, suffix] of units) {
    if (value >= limit) {
      return "$" + (value / limit).toFixed(2).replace(/\.?0+$/, "") + suffix;
    }
  }

  return "$" + Number(value).toLocaleString("en-US");
}

function renderCareers() {
  const container = document.getElementById("business-content");

  if (!container) {
    console.error("Business content element not found!");
    return;
  }

  container.innerHTML = careerData.map(career => `
    <div class="career-card" data-career-id="${career.id}">
      <h3>${String(career.id).padStart(2, "0")}. ${career.title}</h3>

      <p class="career-description">${career.description}</p>

      <div class="career-price">
        ${formatCash(career.price)}
      </div>

      <div class="career-stats">
        <p>Passive Income:
          <strong>${formatCash(career.passiveIncome)} / sec</strong>
        </p>

        <p>Click Income:
          <strong>${formatCash(career.clickIncome)} / click</strong>
        </p>
      </div>
    </div>
  `).join("");

  console.log("30 careers rendered successfully.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderCareers);
} else {
  renderCareers();
}
