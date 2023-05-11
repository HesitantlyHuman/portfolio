export const themes = {
    light: {
        name: "light",
        animation: {
            theme: {
                transition: "0.1s ease-in-out",
            }
        },
        style: {
            border: {
                width: "1px",
            }
        },
        colors: {
            background: '#FEFEFE',
            section: "#F2F1F0",
            label: {
                background: "#E6E5E5",
                border: "#CDCECF",
                text: "#697276"
            },
            card: {
                background: "#fff",
                accent: "#CDCECF",
                highlight: "#9BA0A2",
                dark: "#9BA0A2",
                footer: "#9BA0A2"
            },
            contact: {
                header: "#697276",
                body: "#9BA0A2"
            },
            hero: {
                background: "#fff",
                highlight: "#F2F1F0",
                border: "#CDCECF"
            },
            text: {
                header: "#1D1E20",
                body: "2A3135",
                ondark: "#fff"
            }
        }
    },
    dark: {
        name: "dark",
        animation: {
            theme: {
                transition: "all 0.3s ease-in-out",
            }
        },
        style: {
            border: {
                width: "1px",
            }
        },
        colors: {
            background: '#1D1E20',
            section: "#24282B",
            label: {
                background: "#697276",
                border: "#9BA0A2",
                text: "#CDCECF"
            },
            card: {
                background: "#313539",
                accent: "#697276",
                highlight: "#9BA0A2",
                dark: "#313539",
                footer: "#697276"
            },
            contact: {
                header: "#313539",
                body: "#24282B"
            },
            hero: {
                background: "#24282B",
                highlight: "#313539",
                border: "#697276"
            },
            text: {
                header: "#fff",
                body: "#E6E5E5",
                ondark: "#E6E5E5"
            },
        }
    }
};