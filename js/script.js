// =====================================================
// IDIOMAS
// =====================================================

const supportedLanguages = ["es", "en", "nl"];

let currentLanguage = "es";

// Aquí guardamos las traducciones del idioma actual
let translations = {};

// Categoría de localización actualmente abierta
let activeLocation = null;


// =====================================================
// OBTENER IDIOMA DE LA URL
// =====================================================

function getLanguageFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const lang =
        params.get("lang");

    if (
        supportedLanguages.includes(lang)
    ) {

        return lang;

    }

    return null;

}


// =====================================================
// OBTENER IDIOMA DEL NAVEGADOR
// =====================================================

function getBrowserLanguage() {

    const browserLanguage =
        navigator.language
            .toLowerCase()
            .substring(0, 2);


    if (
        supportedLanguages.includes(
            browserLanguage
        )
    ) {

        return browserLanguage;

    }


    return "es";

}


// =====================================================
// OBTENER IDIOMA INICIAL
// =====================================================

function getInitialLanguage() {

    const urlLanguage =
        getLanguageFromURL();


    if (urlLanguage) {

        return urlLanguage;

    }


    return getBrowserLanguage();

}


// =====================================================
// OBTENER VALOR DEL JSON
// =====================================================

function getNestedValue(
    object,
    path
) {

    return path
        .split(".")
        .reduce(
            (current, key) =>
                current?.[key],
            object
        );

}


// =====================================================
// CARGAR IDIOMA
// =====================================================

async function loadLanguage(language) {

    try {

        const response =
            await fetch(
                `i18n/${language}.json`
            );


        if (!response.ok) {

            throw new Error(
                `No se pudo cargar ${language}.json`
            );

        }


        // Guardamos las traducciones
        // en la variable global

        translations =
            await response.json();


        // =============================================
        // INSERTAR TEXTOS EN EL HTML
        // =============================================

        document
            .querySelectorAll("[data-i18n]")
            .forEach(element => {

                const key =
                    element.dataset.i18n;


                const text =
                    getNestedValue(
                        translations,
                        key
                    );


                if (text !== undefined) {

                    element.textContent =
                        text;

                }

            });


        // =============================================
        // ACTUALIZAR LANG DEL HTML
        // =============================================

        document.documentElement.lang =
            language;


        // =============================================
        // ACTUALIZAR BOTÓN DE IDIOMA ACTIVO
        // =============================================

        document
            .querySelectorAll("[data-lang]")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.lang === language
                );

            });


        // Guardamos idioma actual

        currentLanguage =
            language;

        if (typeof renderFAQs === "function") {
            renderFAQs();
        }

        // =============================================
        // ACTUALIZAR LOCATION GUIDE
        // =============================================

        // Si había una categoría abierta,
        // la volvemos a pintar con el nuevo idioma.

        if (activeLocation) {

            showLocationContent(
                activeLocation
            );

        }


    } catch (error) {

        console.error(
            "Error cargando idioma:",
            error
        );

    }

}


// =====================================================
// CAMBIAR IDIOMA
// =====================================================

function changeLanguage(language) {

    if (
        !supportedLanguages.includes(
            language
        )
    ) {

        return;

    }


    // =============================================
    // ACTUALIZAR URL
    // =============================================

    const url =
        new URL(
            window.location.href
        );


    url.searchParams.set(
        "lang",
        language
    );


    window.history.pushState(
        {},
        "",
        url
    );


    // =============================================
    // CARGAR NUEVO IDIOMA
    // =============================================

    loadLanguage(
        language
    );

}


// =====================================================
// BOTONES DE IDIOMA
// =====================================================

document
    .querySelectorAll("[data-lang]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                changeLanguage(
                    button.dataset.lang
                );

            }
        );

    });


// =====================================================
// INICIALIZAR IDIOMA
// =====================================================

const initialLanguage =
    getInitialLanguage();


loadLanguage(
    initialLanguage
);


// =====================================================
// NAVEGACIÓN DESKTOP - SCROLL
// =====================================================

window.addEventListener(
    "scroll",
    () => {

        const nav =
            document.querySelector(
                ".main-nav"
            );


        // Por seguridad, comprobamos
        // que exista la navegación

        if (!nav) {

            return;

        }


        if (window.scrollY > 50) {

            nav.classList.add(
                "scrolled"
            );

        } else {

            nav.classList.remove(
                "scrolled"
            );

        }

    }
);


// =====================================================
// MENÚ MÓVIL
// =====================================================

const mobileMenuButton =
    document.getElementById(
        "mobileMenuButton"
    );


const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );


// Comprobamos que existan
// antes de añadir eventos

if (
    mobileMenuButton &&
    mobileMenu
) {

    // =============================================
    // ABRIR / CERRAR MENÚ
    // =============================================

    mobileMenuButton.addEventListener(
        "click",
        () => {

            mobileMenu.classList.toggle(
                "open"
            );


            mobileMenuButton.classList.toggle(
                "open"
            );

        }
    );


    // =============================================
    // CERRAR AL PULSAR UN ENLACE
    // =============================================

    const mobileLinks =
        document.querySelectorAll(
            ".mobile-links a"
        );


    mobileLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mobileMenu.classList.remove(
                    "open"
                );


                mobileMenuButton.classList.remove(
                    "open"
                );

            }
        );

    });

}


// =====================================================
// COUNTDOWN
// =====================================================

// Fecha y hora de la boda
//
// Formato:
// AÑO-MES-DÍA T:MINUTOS:SEGUNDOS
//
// 30 de julio de 2027 a las 16:00

const weddingDate =
    new Date(
        "2027-07-30T16:00:00"
    ).getTime();


// =====================================================
// ACTUALIZAR COUNTDOWN
// =====================================================

function updateCountdown() {

    const now =
        new Date().getTime();


    const difference =
        weddingDate - now;


    // =============================================
    // SI LA FECHA YA HA PASADO
    // =============================================

    if (difference <= 0) {

        const days =
            document.getElementById(
                "days"
            );

        const hours =
            document.getElementById(
                "hours"
            );

        const minutes =
            document.getElementById(
                "minutes"
            );

        const seconds =
            document.getElementById(
                "seconds"
            );


        if (days) {

            days.textContent = "00";

        }


        if (hours) {

            hours.textContent = "00";

        }


        if (minutes) {

            minutes.textContent = "00";

        }


        if (seconds) {

            seconds.textContent = "00";

        }


        return;

    }


    // =============================================
    // CALCULAR DÍAS
    // =============================================

    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    // =============================================
    // CALCULAR HORAS
    // =============================================

    const hours =
        Math.floor(
            (
                difference /
                (1000 * 60 * 60)
            ) % 24
        );


    // =============================================
    // CALCULAR MINUTOS
    // =============================================

    const minutes =
        Math.floor(
            (
                difference /
                (1000 * 60)
            ) % 60
        );


    // =============================================
    // CALCULAR SEGUNDOS
    // =============================================

    const seconds =
        Math.floor(
            (
                difference /
                1000
            ) % 60
        );


    // =============================================
    // MOSTRAR RESULTADOS
    // =============================================

    const daysElement =
        document.getElementById(
            "days"
        );


    const hoursElement =
        document.getElementById(
            "hours"
        );


    const minutesElement =
        document.getElementById(
            "minutes"
        );


    const secondsElement =
        document.getElementById(
            "seconds"
        );


    if (daysElement) {

        daysElement.textContent =
            String(days).padStart(
                2,
                "0"
            );

    }


    if (hoursElement) {

        hoursElement.textContent =
            String(hours).padStart(
                2,
                "0"
            );

    }


    if (minutesElement) {

        minutesElement.textContent =
            String(minutes).padStart(
                2,
                "0"
            );

    }


    if (secondsElement) {

        secondsElement.textContent =
            String(seconds).padStart(
                2,
                "0"
            );

    }

}


// Ejecutar inmediatamente

updateCountdown();


// Actualizar cada segundo

setInterval(
    updateCountdown,
    1000
);


// =====================================================
// LOCATION GUIDE
// =====================================================

// Botones de las 4 categorías

const locationButtons =
    document.querySelectorAll(
        ".location-category"
    );


// Contenedor donde aparecerá
// el contenido de cada categoría

const locationContent =
    document.getElementById(
        "locationContent"
    );


// =====================================================
// BOTONES DE LOCATION GUIDE
// =====================================================

locationButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const location =
                    button.dataset.location;


                // Si pulsamos otra vez
                // la misma categoría,
                // cerramos el contenido.

                if (
                    activeLocation ===
                    location
                ) {

                    closeLocationContent();

                    return;

                }


                // Quitar active de todos

                locationButtons.forEach(
                    button => {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


                // Activar el seleccionado

                button.classList.add(
                    "active"
                );


                // Guardar categoría activa

                activeLocation =
                    location;


                // Mostrar contenido

                showLocationContent(
                    location
                );

            }
        );

    }
);


// =====================================================
// MOSTRAR CONTENIDO DE LOCATION GUIDE
// =====================================================

function showLocationContent(
    location
) {

    // =============================================
    // OBTENER TÍTULO
    // =============================================

    const title =
        getNestedValue(
            translations,
            `locationGuide.${location}.title`
        );


    // =============================================
    // OBTENER TEXTO
    // =============================================

    const text =
        getNestedValue(
            translations,
            `locationGuide.${location}.text`
        );


    // =============================================
    // OBTENER TEXTO DEL BOTÓN CERRAR
    // =============================================

    const closeText =
        getNestedValue(
            translations,
            "locationGuide.close"
        );


    // =============================================
    // COMPROBAR QUE EXISTAN
    // =============================================

    if (
        title === undefined ||
        text === undefined
    ) {

        console.error(
            `No se encontraron las traducciones para: ${location}`
        );

        return;

    }


    // =============================================
    // CREAR HTML
    // =============================================

    locationContent.innerHTML = `

        <div class="location-panel">

            <div class="location-panel-text">

                <h3>
                    ${title}
                </h3>


                <p>
                    ${text}
                </p>


                <button
                    class="location-close"
                    id="locationClose">

                    ${closeText}

                </button>

            </div>

        </div>

    `;


    // =============================================
    // ABRIR PANEL
    // =============================================

    // requestAnimationFrame permite que
    // la animación CSS se ejecute correctamente.

    requestAnimationFrame(
        () => {

            locationContent.classList.add(
                "open"
            );

        }
    );


    // =============================================
    // BOTÓN CERRAR
    // =============================================

    const closeButton =
        document.getElementById(
            "locationClose"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeLocationContent
        );

    }

}


// =====================================================
// CERRAR LOCATION GUIDE
// =====================================================

function closeLocationContent() {

    locationContent.classList.remove(
        "open"
    );
    // Quitar estado activo de los círculos

    locationButtons.forEach(
        button => {

            button.classList.remove(
                "active"
            );

        }
    );


    activeLocation = null;

}