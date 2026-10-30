
/* =====================================
   LOS CAPITALOS - CAREER SYSTEM
===================================== */

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

const api = window.LosCapitalos;
const container = document.getElementById("business-content");

if (!api || !container) {
    console.error("Career system could not start.");
} else {

    const player = api.getPlayer();

    const MAX_OFFLINE_SECONDS = 12 * 60 * 60;

    // STYLES
    const style = document.createElement("style");

    style.textContent = `
        .career-card {
            position: relative;
            padding: 18px;
            margin-bottom: 14px;
            border: 1px solid rgba(255,255,255,0.10);
            border-radius: 14px;
            background: rgba(255,255,255,0.045);
            transition: 0.2s ease;
        }

        .career-card.active-career {
            border: 1px solid #35d47a;
            background: rgba(53,212,122,0.13);
            box-shadow: 0 0 18px rgba(53,212,122,0.10);
        }

        .career-card h3 {
            margin-top: 0;
        }

        .career-description {
            opacity: 0.7;
        }

        .career-price {
            font-size: 21px;
            font-weight: bold;
            margin: 12px 0;
        }

        .career-stats p {
            margin: 7px 0;
        }

        .career-active-label {
            display: inline-block;
            color: #35d47a;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1px;
            margin-bottom: 9px;
        }

        .career-buy-button {
            width: 100%;
            padding: 12px;
            margin-top: 12px;
            border: none;
            border-radius: 9px;
            background: #35d47a;
            color: #07140c;
            font-weight: 800;
            cursor: pointer;
        }

        .career-buy-button:disabled {
            opacity: 0.45;
            cursor: not-allowed;
        }

        .offline-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(0,0,0,0.82);
        }

        .offline-box {
            width: 100%;
            max-width: 360px;
            padding: 26px;
            border-radius: 18px;
            text-align: center;
            background: #17221c;
            border: 1px solid #35d47a;
            color: white;
        }

        .offline-box h2 {
            margin-top: 0;
        }

        .offline-amount {
            color: #35d47a;
            font-size: 29px;
            font-weight: 900;
            margin: 20px 0;
        }

        .offline-collect {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 10px;
            background: #35d47a;
            color: #07140c;
            font-weight: 900;
            cursor: pointer;
        }
    `;

    document.head.appendChild(style);

    function formatCash(value) {
        return api.formatMoney(value);
    }

    function getActiveCareer() {
        return careerData.find(
            career => career.id === Number(player.activeCareerId)
        ) || null;
    }

    function getClickIncome() {
        const career = getActiveCareer();

        return career ? career.clickIncome : 1;
    }

    function getPassiveIncome() {
        const career = getActiveCareer();

        return career ? career.passiveIncome : 0;
    }

    function renderCareers() {
        const activeId = Number(player.activeCareerId) || 0;

        container.innerHTML = careerData.map(career => {
            const isActive = career.id === activeId;
            const isCompleted = career.id < activeId;
            const isLocked = career.id > activeId + 1;

            let buttonText = "BUY CAREER";
            let disabled = false;

            if (isActive) {
                buttonText = "ACTIVE JOB";
                disabled = true;
            } else if (isCompleted) {
                buttonText = "COMPLETED";
                disabled = true;
            } else if (isLocked) {
                buttonText = "LOCKED";
                disabled = true;
            } else if (player.balance < career.price) {
                buttonText = "NOT ENOUGH CASH";
                disabled = true;
            }

            return `
                <div class="career-card ${isActive ? "active-career" : ""}"
                     data-career-id="${career.id}">

                    ${isActive ? `
                        <div class="career-active-label">
                            ACTIVE JOB
                        </div>
                    ` : ""}

                    <h3>
                        ${String(career.id).padStart(2, "0")}.
                        ${career.title}
                    </h3>

                    <p class="career-description">
                        ${career.description}
                    </p>

                    <div class="career-price">
                        ${formatCash(career.price)}
                    </div>

                    <div class="career-stats">
                        <p>
                            Passive Income:
                            <strong>
                                ${formatCash(career.passiveIncome)} / sec
                            </strong>
                        </p>

                        <p>
                            Click Income:
                            <strong>
                                ${formatCash(career.clickIncome)} / click
                            </strong>
                        </p>
                    </div>

                    <button
                        class="career-buy-button"
                        data-career-buy="${career.id}"
                        ${disabled ? "disabled" : ""}
                    >
                        ${buttonText}
                    </button>

                </div>
            `;
        }).join("");
    }

    function refreshButtons() {
        const activeId = Number(player.activeCareerId) || 0;

        container.querySelectorAll("[data-career-buy]").forEach(button => {
            const id = Number(button.dataset.careerBuy);
            const career = careerData.find(item => item.id === id);

            if (!career) return;

            if (id === activeId) {
                button.textContent = "ACTIVE JOB";
                button.disabled = true;
            } else if (id < activeId) {
                button.textContent = "COMPLETED";
                button.disabled = true;
            } else if (id > activeId + 1) {
                button.textContent = "LOCKED";
                button.disabled = true;
            } else if (player.balance < career.price) {
                button.textContent = "NOT ENOUGH CASH";
                button.disabled = true;
            } else {
                button.textContent = "BUY CAREER";
                button.disabled = false;
            }
        });
    }

    // CAREER PURCHASE
    container.addEventListener("click", event => {
        const button = event.target.closest("[data-career-buy]");

        if (!button || button.disabled) return;

        const id = Number(button.dataset.careerBuy);
        const career = careerData.find(item => item.id === id);

        if (!career) return;

        const activeId = Number(player.activeCareerId) || 0;

        if (id !== activeId + 1) return;

        if (player.balance < career.price) return;

        player.balance -= career.price;
        player.activeCareerId = career.id;
        player.lastAccrualAt = Date.now();
        player.pendingOffline = 0;

        api.savePlayer();
        api.updatePlayerInterface();

        renderCareers();

        console.log("Career purchased:", career.title);
    });

    // OFFLINE POPUP
    function showOfflinePopup() {
        const amount = Number(player.pendingOffline) || 0;

        if (amount <= 0) return;

        const overlay = document.createElement("div");
        overlay.className = "offline-overlay";

        const box = document.createElement("div");
        box.className = "offline-box";

        const title = document.createElement("h2");
        title.textContent = "Welcome back, Boss!";

        const message = document.createElement("p");
        message.textContent = "While you were away, your business earned:";

        const amountText = document.createElement("div");
        amountText.className = "offline-amount";
        amountText.textContent = formatCash(amount);

        const collect = document.createElement("button");
        collect.className = "offline-collect";
        collect.textContent = "COLLECT";

        collect.addEventListener("click", () => {
            const reward = Number(player.pendingOffline) || 0;

            player.pendingOffline = 0;
            player.lastAccrualAt = Date.now();

            api.addEarnings(reward);
            api.savePlayer();

            overlay.remove();
            refreshButtons();
        });

        box.appendChild(title);
        box.appendChild(message);
        box.appendChild(amountText);
        box.appendChild(collect);

        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    // CALCULATE OFFLINE EARNINGS
    function initializeOfflineEarnings() {
        const career = getActiveCareer();

        if (!career) {
            player.lastAccrualAt = null;
            player.pendingOffline = 0;
            api.savePlayer();
            return;
        }

        if (Number(player.pendingOffline) > 0) {
            showOfflinePopup();
            return;
        }

        const now = Date.now();
        const last = Number(player.lastAccrualAt);

        if (!last || !Number.isFinite(last)) {
            player.lastAccrualAt = now;
            api.savePlayer();
            return;
        }

        const elapsed = Math.max(
            0,
            Math.floor((now - last) / 1000)
        );

        const cappedSeconds = Math.min(
            elapsed,
            MAX_OFFLINE_SECONDS
        );

        const reward = cappedSeconds * career.passiveIncome;

        if (reward > 0) {
            player.pendingOffline = reward;
            player.lastAccrualAt = null;

            api.savePlayer();
            showOfflinePopup();
        } else {
            player.lastAccrualAt = now;
            api.savePlayer();
        }
    }

    // PASSIVE INCOME WHILE GAME IS OPEN
    function processPassiveIncome() {
        const career = getActiveCareer();

        if (!career) return;

        if (Number(player.pendingOffline) > 0) return;

        const now = Date.now();
        const last = Number(player.lastAccrualAt);

        if (!last || !Number.isFinite(last)) {
            player.lastAccrualAt = now;
            api.savePlayer();
            return;
        }

        const elapsed = Math.max(
            0,
            Math.floor((now - last) / 1000)
        );

        if (elapsed <= 0) return;

        const seconds = Math.min(
            elapsed,
            MAX_OFFLINE_SECONDS
        );

        api.addEarnings(seconds * career.passiveIncome);

        player.lastAccrualAt = now;
        api.savePlayer();

        refreshButtons();
    }

    // START SYSTEM
    renderCareers();
    initializeOfflineEarnings();

    window.LosCapitalosBusiness = {
        getClickIncome,
        getPassiveIncome,
        refreshButtons
    };

    // Refresh Home after business system is ready.
    api.updatePlayerInterface();

    setInterval(processPassiveIncome, 1000);

    console.log("Los Capitalos career system initialized.");
}
