const API_Key = "5a5eb02b53932b2244b2748a636439c9";
const url = "https://gnews.io/api/v4/search?q=";

function reload() {
    window.location.reload();
}

window.addEventListener("load", () => fetchNews("World"));

const loadingScreen = document.getElementById("loading-screen");

loadingScreen.style.display = "flex";

async function fetchNews(query) {

    try {
        const response = await fetch(`${url}${query}&lang=en&country=us&max=10&apikey=${API_Key}`);

        const store = await response.json();

        const articles = store.articles || store.news || [];

        mixData(articles);

    } 
    
    catch (error) {
        console.error("Error fetching data:", error);
    } 
    
    finally {
        loadingScreen.style.display = "none";
    }
}

function mixData(articles) {

    const cardsContainer = document.querySelector('#cards-container');
    const cardTemplate = document.querySelector('#card-template');

    // Sort articles by latest to oldest
    articles.sort((latest, oldest) => new Date(oldest.publishedAt) - new Date(latest.publishedAt));

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.image) return;

        const cardContentClone = cardTemplate.content.cloneNode(true);
        insertCardData(cardContentClone, article);
        cardsContainer.appendChild(cardContentClone);
    });
}

function insertCardData(cardContentClone, article) {

    const newsImg = cardContentClone.querySelector('#news-pic');

    const newsTitle = cardContentClone.querySelector('#news-title');

    const newsSource = cardContentClone.querySelector('#news-source');

    const newsDetails = cardContentClone.querySelector('#news-details');

    newsImg.src = article.image;
    newsTitle.innerHTML = article.title;
    newsDetails.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-Us", {
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} 🔹 ${date}`;

    cardContentClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let selectedNavItem = null;

function onNavItemClick(id) {

    fetchNews(id);
    const navItem = document.getElementById(id);

    selectedNavItem?.classList.remove("active");

    selectedNavItem = navItem;
    selectedNavItem.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
}


const searchButton = document.querySelector('#search-btn');
const searchText = document.querySelector('#search-input');
const clearSearchButton = document.querySelector("#clear-search");

searchButton.addEventListener("click", () => {
    const input = searchText.value;
    if (!input) return;

    fetchNews(input);
    window.scrollTo({ top: 0, behavior: "smooth" });
    selectedNavItem?.classList.remove("active");
    selectedNavItem = null;
});

searchText.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const input = searchText.value.trim();
        if (input) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            fetchNews(input);
            selectedNavItem?.classList.remove("active");
            selectedNavItem = null;
        }
    }
});

const darkModeToggle = document.getElementById("dark-mode-toggle");
const body = document.body;
const navigation = document.querySelector('#full-nav');
const navList = document.querySelector('#nav-list');

darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    navigation.classList.toggle("dark-mode");
    navList.classList.toggle("dark-mode-text");
});

const searchInput = document.querySelector('#search-input');
const clearSearchIcon = document.querySelector('#clear-search');

searchInput.addEventListener("input", () => {
    clearSearchIcon.style.display = searchInput.value ? "block" : "none";
});

clearSearchIcon.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchIcon.style.display = "none";
    searchInput.focus();
});

const scrollToTopButton = document.getElementById("scroll-to-top");

scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
