// Initialize EmailJS
(function(){
  emailjs.init("L7OVBMyNKCDepbswR");
})();

// Menu Data
const menu = {
  hotDrinks: ["Coffee", "Tea", "Hot Chocolate"],
  icedDrinks: ["Iced Coffee", "Iced Tea"],
  juices: ["Passion Juice", "Pineapple Juice", "Tree Tomato Juice"],
  smoothies: ["Banana Smoothie", "Strawberry Smoothie", "Le Chic Café Shake"],
  milkshakes: ["Vanilla", "Chocolate", "Oreo"],
  healthy: ["Fruits Plate", "Macedoine"],
  breakfast: ["Toast", "Sandwich", "Omelette"],
  lunch: ["Rice", "Spaghetti", "Wraps", "Chicken", "Beef"],
  dinner: ["Pizza", "Burgers", "Salads", "Fish"]
};

const params = new URLSearchParams(window.location.search);
const table = params.get("table");

const statusText = document.getElementById("status");
const menuDiv = document.getElementById("menu");
const spinner = document.querySelector(".spinner");
const sound = document.getElementById("notifySound");

if(table){
    statusText.innerHTML = "Fetching weather & generating menu...";
    
    // 1️⃣ Send email notification
    emailjs.send("service_s88acd7","template_io3n30m",{
      table_number: table,
      time: new Date().toLocaleString()
    }).then(() => {
        console.log("Email sent");
    }).catch(err => {
        console.log("Email error", err);
    });

    // 2️⃣ Get current time
    let hour = new Date().getHours();
    let suggestedItems = [];

    // 3️⃣ Fetch weather
    const apiKey = "eac81531225c5562b2490a0bc0dc4a35";
    const city = "Kigali";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
        const temp = data.main.temp;
        const weather = data.weather[0].main.toLowerCase();

        // 4️⃣ Determine suggestions
        if(hour < 11){
            suggestedItems.push(...menu.breakfast, ...menu.hotDrinks);
        } else if(hour < 15){
            suggestedItems.push(...menu.lunch, ...menu.icedDrinks, ...menu.juices);
        } else {
            suggestedItems.push(...menu.dinner, ...menu.smoothies, ...menu.milkshakes);
        }

        if(weather.includes("rain")){
            suggestedItems.push(...menu.hotDrinks, "Soup");
        } else if(weather.includes("clear") && temp > 25){
            suggestedItems.push(...menu.icedDrinks, ...menu.smoothies, ...menu.juices);
        }

        // 5️⃣ Display menu & highlight suggestions
        menuDiv.innerHTML = "";
        for(const category in menu){
            const catDiv = document.createElement("div");
            catDiv.className = "menu-category";
            catDiv.textContent = category;
            menuDiv.appendChild(catDiv);

            menu[category].forEach(item => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "menu-item";
                if(suggestedItems.includes(item)){
                    itemDiv.innerHTML = "✅ " + item; // highlight suggested
                } else {
                    itemDiv.textContent = item;
                }
                menuDiv.appendChild(itemDiv);
            });
        }

        spinner.style.display = "none";
        statusText.innerHTML = `Welcome! Staff notified for Table ${table}`;
        sound.play();
    }).catch(err => {
        spinner.style.display = "none";
        statusText.innerHTML = "Error fetching weather. Showing menu anyway.";
        console.log(err);
    });

} else {
    spinner.style.display = "none";
    statusText.innerHTML = "Invalid QR Code.";
}
