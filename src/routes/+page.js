/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    return {
        navigation: {
            links: [
                {
                    name: "About",
                    link: "about",
                },
                {
                    name: "Projects",
                    link: "projects",
                },
                {
                    name: "Experience",
                    link: "experience",
                },
                {
                    name: "Resume",
                    link: "downloads",
                },
                {
                    name: "Contact",
                    link: "contact",
                },
            ]
        },
        about: {
            name: "Tanner Sims",
            blurb: "idk, I code stuff I guess",
            links: [
                { name: "Github", link: "" },
                { name: "Linkedin", link: "" },
            ]
        },
        projects: [
            {
                name: "Open Lyrics Dataset",
                description: "A dataset of song lyrics",
                category: "Data collection",
                image: "/src/images/lyrics.jpg",
                image_alt: "lyrics on sheet music",
                techs: ["Python"],
                links: [
                    {
                        name: "GitHub",
                        url: "",
                    },
                ],
            },
            {
                name: "Generating structured latent spaces with VAEs",
                description:
                    "Implementation of a novel method for deep archetypal analysis, with the aim of creating highly interpretable latent spaces.",
                category: "Machine learning",
                image: "/src/images/nebula.webp",
                image_alt: "a nebula",
                techs: ["Python", "PyTorch"],
                links: [
                    {
                        name: "GitHub",
                        url: "",
                    },
                    {
                        name: "Paper",
                        url: "",
                    },
                ],
            },
            {
                name: "Calculating optimal bets in CamelUp",
                description:
                    "Ever played this obscure yet fun board game, and felt a burning desire to win at all costs? Well, you're in luck! I spent far too many hours of my life creating the stockcamel engine in high performance, multi-threaded rust.",
                category: "Game theory",
                image: "/src/images/dice.jpg",
                image_alt: "Black and white dice",
                techs: ["Rust"],
                links: [
                    {
                        name: "GitHub",
                        url: "",
                    },
                    {
                        name: "Link",
                        url: "",
                    },
                ],
            },
        ],
        experience: [
            {
                position: "Machine Learning Consultant",
                company: "Opsis Health",
                duration: "Jan 2022 - Present",
                description: "Use python and pytorch to build, train and test various point cloud volume estimation models for upcoming Opsis health product. Implement and optimize new point cloud network methods based on recent white papers. Coordinate with deployment team to develop model pipeline and retraining strategies.",
                link: "https://www.opsishealth.com/"
            },
            {
                position: "Machine Learning Specialist",
                company: "Branch",
                duration: "Aug 2021 - Apr 2022",
                description: "Did some stuff ¯\_(ツ)_/¯"
            },
            {
                position: "Technical Lead",
                company: "Branch",
                duration: "Apr 2022 - Jan 2023",
                description: "Did some stuff ¯\_(ツ)_/¯"
            },
            {
                position: "Research Assistant",
                company: "University of Utah",
                duration: "Jan 2021 - Present",
                description: "Worky worky",
                link: "https://www.math.utah.edu"
            }
        ],
        downloads: [
            {
                name: "Resume",
                download_url: "downloads/resume.pdf",
                image: "/src/images/resume.png",
                file_size: "1.2MB",
            },
            {
                name: "CV",
                download_url: "downloads/cv.pdf",
                image: "/src/images/cv.png",
                file_size: "0.9MB"
            }
        ],
        contacts: [
            {
                name: "Email",
                text: "none@gmail.com",
                link: "mailto",
            },
            {
                name: "Github",
                text: "/none",
                link: ""
            },
            {
                name: "Linkedin",
                text: "/none",
                link: ""
            }
        ]
    };
}