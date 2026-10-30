
const careers = [
  { title: "Cargo Handler", description: "Start your career carrying cargo." },
  { title: "Warehouse Worker", description: "Work in warehouse operations." },
  { title: "Cashier", description: "Handle payments and daily sales." },
  { title: "Delivery Driver", description: "Deliver goods across the city." },
  { title: "Security Guard", description: "Protect businesses and properties." },
  { title: "Construction Worker", description: "Build your future from the ground up." },
  { title: "Factory Operator", description: "Manage factory production." },
  { title: "Forklift Operator", description: "Handle industrial transportation." },
  { title: "Truck Driver", description: "Transport goods across the country." },
  { title: "Taxi Driver", description: "Build your income on the road." },
  { title: "Mechanic", description: "Repair vehicles and grow your business." },
  { title: "Electrician", description: "Provide professional electrical services." },
  { title: "Plumber", description: "Build a profitable service business." },
  { title: "Restaurant Owner", description: "Manage your own restaurant." },
  { title: "Logistics Manager", description: "Control large-scale logistics operations." },
  { title: "Accountant", description: "Manage finances for major clients." },
  { title: "Real Estate Agent", description: "Enter the property market." },
  { title: "Business Consultant", description: "Help companies grow and succeed." },
  { title: "Lawyer", description: "Build a powerful legal career." },
  { title: "Architect", description: "Design major commercial projects." },
  { title: "Company Director", description: "Lead an established company." },
  { title: "Import & Export Manager", description: "Manage international trade." },
  { title: "Investment Analyst", description: "Analyze financial markets." },
  { title: "Stockbroker", description: "Trade stocks and manage investments." },
  { title: "Real Estate Investor", description: "Build a property portfolio." },
  { title: "Venture Capitalist", description: "Invest in promising companies." },
  { title: "Hedge Fund Manager", description: "Manage large investment portfolios." },
  { title: "Corporate Executive", description: "Control major corporate operations." },
  { title: "Millionaire Investor", description: "Build a million-dollar fortune." },
  { title: "Los Capitalos", description: "Reach the top of the business world." }
];

const careerData = careers.map((career, index) => {
  const price = 500n * (3n ** BigInt(index));

  // Gelir artışı, fiyat artışından daha yavaş ilerler.
  const passiveIncome = Math.round(
    Math.pow(3, index * 0.74) * 100
  ) / 100;

  return {
    id: index + 1,
    title: career.title,
    price,
    passiveIncome,
    clickIncome: Math.max(1, Math.round(passiveIncome * 0.1)),
    description: career.description
  };
});

const businessContent = document.getElementById("business-content");

function formatCash(value) {
  return "$" + value.toLocaleString("en-US");
}

function renderCareers() {
  if (!businessContent) return;

  businessContent.innerHTML = careerData.map(career => `
    <div class="career-card" data-career-id="${career.id}">
      <h3>${String(career.id).padStart(2, "0")}. ${career.title}</h3>

      <p class="career-description">
        ${career.description}
      </p>

      <div class="career-price">
        ${formatCash(career.price)}
      </div>

      <div class="career-stats">
        <p>Passive Income:
          <strong>$${career.passiveIncome.toLocaleString("en-US")} / sec</strong>
        </p>

        <p>Click Income:
          <strong>$${career.clickIncome.toLocaleString("en-US")} / click</strong>
        </p>
      </div>
    </div>
  `).join("");
}

renderCareers();
