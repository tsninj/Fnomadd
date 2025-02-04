class ThemeToggle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
                button {
                    cursor: pointer;
                    padding: 5px 10px;
                    border: none;
                    background-color: var(--btn-bg);
                    color: var(--btn-text);
                    font-size: 16px;
                    border-radius: 5px;
                    margin-left: 20px;
                    margin-bottom: 20px;
                }
                :host-context(html.light-mode) button {
                    --btn-bg: #ddd;
                    --btn-text: #333;
                }
                :host-context(html.dark-mode) button {
                    --btn-bg: #333;
                    --btn-text: --var(bg-color);
                }
            </style>
            <button id="toggle-btn">🌙</button>
        `;
    }

    connectedCallback() {
        this.button = this.shadowRoot.getElementById("toggle-btn");
        this.button.addEventListener("click", () => this.toggleTheme());
        this.setInitialTheme();
    }

    setInitialTheme() {
        const theme = localStorage.getItem("theme") || "light-mode";
        document.documentElement.classList.add(theme);
        this.updateButton(theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.classList.contains("dark-mode") ? "dark-mode" : "light-mode";
        const newTheme = currentTheme === "dark-mode" ? "light-mode" : "dark-mode";

        document.documentElement.classList.remove(currentTheme);
        document.documentElement.classList.add(newTheme);
        localStorage.setItem("theme", newTheme);

        this.updateButton(newTheme);
    }

    updateButton(theme) {
        this.button.textContent = theme === "dark-mode" ? "☀️" : "🌙";
    }
}

customElements.define("theme-toggle", ThemeToggle);
