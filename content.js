// ADDED: Wrapper to ensure isolated scope within the Chrome Extension environment
(function () {
    'use strict';

    /**
     * ======================================================================================
     * SECTION 1: ASSET LIBRARY
     * ======================================================================================
     */
    const ASSETS = {
        noise: `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E`,
        heavyGrain: `data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E`,
        bat: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23000' d='M256 218c-9.7 0-18.4 4.8-24 12.1-12.8-11.8-31.5-30-61.1-30-29.4 0-48.6 15.2-61.2 26.3-15.3-21.6-46.7-43.8-82.6-26.6-6.6 3.1-9.4 11-6.3 17.6 1.7 3.6 5.3 5.7 9 5.7 2.2 0 4.5-.7 6.4-2.2 16.4-12.7 34.6-9.1 48 1.1 24.3 18.5 28.3 50.1 29.5 66.8 1.4 19.4 13.9 14.1 19.9 8.1 8-8 37.4-44.5 37.4-44.5 9.7 2.4 15.6 12 15.6 22 0 7-3.7 13.6-9.7 17.2-12.4 7.4-12.3 25.1-12.3 25.2 0 6.8 5.1 12.6 11.9 13.5 13.5 1.7 25.4-8 27.2-21.5.8-6.1 2.3-12.3 4.4-18.2 5.1 11 13.9 18.8 24.3 20.6 1.8.3 3.5.5 5.3.5 9.7 0 18.4-4.8 24-12.1 5.6 7.3 14.3 12.1 24 12.1 1.8 0 3.5-.2 5.3-.5 10.4-1.8 19.2-9.6 24.3-20.6 2.1 5.9 3.6 12.1 4.4 18.2 1.8 13.5 13.7 23.2 27.2 21.5 6.8-.9 11.9-6.6 11.9-13.5 0-.1.1-17.8-12.3-25.2-6-3.6-9.7-10.2-9.7-17.2 0-10 5.9-19.6 15.6-22 0 0 29.4 36.5 37.4 44.5 6 6 18.5 11.3 19.9-8.1 1.2-16.7 5.2-48.3 29.5-66.8 13.4-10.2 31.6-13.8 48-1.1 1.9 1.5 4.2 2.2 6.4 2.2 3.7 0 7.3-2.1 9-5.7 3.1-6.6.3-14.4-6.3-17.6-35.9-17.2-67.3 5-82.6 26.6-12.5-11.1-31.8-26.3-61.2-26.3-29.6 0-48.3 18.2-61.1 30-5.6-7.3-14.3-12.1-24-12.1z'/%3E%3C/svg%3E`,
        snowflake: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 12h20M12 2v20M20 20L4 4m16 0L4 20'/%3E%3C/svg%3E`,
        // Modern Sleigh Silhouette SVG
        sleigh: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 218'%3E%3Cpath fill='%23fffdd0' d='M468.3 78.8c-4.8-23.9-24.9-42.3-49.1-45.1-3.3-.4-6.6-.6-9.8-.6-21.6 0-41 11.5-51.8 30.6-1.4 2.5-2.6 5.1-3.6 7.7-7.2-7.1-16.3-12-26.4-13.9-3.5-.6-7-.9-10.6-.9-18.3 0-35.1 8.1-46.5 22-12.6-16.7-31.8-27.8-53.5-29.9-3.7-.4-7.3-.5-11-.5-22.8 0-43.6 11.7-55.4 31.2-1.2-1.6-2.5-3.3-3.8-4.8-12.6-14.7-31.1-23.2-50.4-23.2-3.1 0-6.3.2-9.3.7-19.4 3.1-36.2 16.3-44.2 34.6-10.6-8.3-23.5-12.8-37-12.8-6.6 0-13.2 1.1-19.5 3.3C12.1 87.8 0 112.6 0 139.8c0 6.2 1 12.4 3.1 18.3 4.6 13.5 14.8 24.6 28 30.5 9.6 4.3 20 6.5 30.5 6.5 3.6 0 7.3-.3 10.8-.8 19.8-3 37-16.1 45.1-34.2 7.9 5.3 16.9 8.5 26.4 9.3 3.8.3 7.6.5 11.5.5 16.9 0 32.7-6.8 44.3-18.6 11 11.2 26 18 42.3 18.8 3.6.2 7.2.3 10.9.3 17.1 0 33.2-6.8 44.9-18.6 8.5 7.6 19.1 12.3 30.5 13.6 3.7.4 7.5.6 11.3.6 14.3 0 27.8-5.1 38.2-14.1 13.1 16.7 32.7 27.6 54.5 28.8 4 .2 7.9.3 11.9.3 23.2 0 44.2-11.7 56.3-31.2 6.1-9.8 9.7-21 10.5-32.8.8-11.8-1.6-23.3-6.9-33.5zM139 131c-7.8 8.4-18.8 13.6-30.6 14.4-1.9.1-3.8.2-5.7.2-13.8 0-26.4-7.1-33.6-18.7-4.8-7.7-7.4-16.6-7.4-25.7 0-20.2 12.4-38 31.2-44.5 3.6-1.2 7.3-1.9 11.1-1.9 10 0 19.5 4 26.4 11.2 6.6 6.8 10.5 15.7 11 25.2.5 9.5-3 18.8-9.3 26.1 1.3 1.4 2.6 3 3.8 4.6 8.3-8.4 19.5-13.9 31.5-15 2.5-.2 5.1-.4 7.6-.4 14.3 0 27.3 6.8 35.5 18.2 3.4-2.7 7-5.3 10.8-7.7 3.8-8.8 9.7-16.6 17.2-22.7 9.4-7.6 21-11.7 33-11.7 2.5 0 5.1.2 7.6.5 13.3 1.7 25.3 9.1 32.8 20.1 5.2 7.7 8.4 16.6 9.3 25.9.9 9.3-2.2 18.5-8.2 26.1 10.6-8.9 23.5-14.2 37.4-14.7 2.8-.1 5.7-.2 8.5-.2 16.9 0 32.3 7.6 42.6 20.5 3.5-2.3 7.1-4.5 10.8-6.6 3.7-9.7 9.6-18.2 17.1-24.8 8.8-7.6 19.9-11.8 31.4-11.8 3.1 0 6.2.3 9.3.8 12.2 2 23.1 9.3 29.7 19.8 5.3 8.5 8.3 18.3 8.6 28.4.3 10-2.7 19.8-8.3 28.1 7.6-7 17.2-11.3 27.4-12.5 2.2-.3 4.5-.4 6.7-.4 10.4 0 20.3 3.6 27.9 10.2 7.3 6.3 11.8 15.3 12.5 24.9.7 9.5-2.9 18.9-9.6 26.2-6.6 7.2-15.8 11.5-25.6 12.1-1.9.1-3.9.2-5.8.2-12.9 0-24.8-6.3-32.3-16.9-7.8-10.9-10.8-24.5-8.5-37.6 2.3-13.2 10.1-24.6 21.2-31.8 4.7-3 10.1-5 15.6-5.9-5.7-8.9-14.4-15.7-24.5-19.2-2.3-.8-4.7-1.2-7.1-1.2-10 0-19.3 4.4-25.8 12.1-6.3 7.3-9.9 16.6-9.9 26.3 0 19.2 11.3 36.1 28.4 43.2 4-3 8.4-5.6 13.1-7.7-4.5 5.7-10.4 10.3-17.1 13.6-9.3 4.6-19.4 7-29.7 7-3.1 0-6.3-.2-9.4-.7-20.5-2.9-36.4-18.2-40.9-38.5-4.5-20.3 4.3-40.8 21.2-51.8 3-2 6.3-3.6 9.7-5-5-6.6-11.9-11.7-19.8-14.6-3.4-1.2-6.9-1.8-10.5-1.8-12.6 0-24.2 6-31.6 16.2-5.9 8.2-9.1 18.1-9.1 28.2 0 19 11 35.8 27.7 43 3.1-1.8 6.3-3.8 9.4-6-5.8 7.6-13.3 13.6-21.9 17.7-8.8 4.2-18.3 6.3-28 6.3-4.2 0-8.3-.4-12.5-1.2-19-3.7-33.4-18.9-36.4-38.1-2.9-19.2 6.3-38.1 22.6-48.6 3.8-2.5 7.8-4.6 12-6.3-6-7.6-14-13.3-23.1-16.5-3.4-1.2-7-1.8-10.6-1.8-13.1 0-25.2 6.6-32.7 17.5-5.8 8.5-8.9 18.5-8.9 28.8 0 18.5 10.5 34.9 26.4 42.4 3.6-2.8 7.5-5.3 11.4-7.6-6.2 8.2-14.3 14.6-23.6 18.8-8.4 3.7-17.4 5.7-26.6 5.7-3 0-6.1-.2-9.1-.6-20.4-2.6-36.6-17.9-41.4-38.1-4.8-20.2 3.7-40.7 20.3-51.9 3.6-2.4 7.5-4.4 11.6-6.1-5.9-6.9-13.6-12.1-22.1-14.9-3.8-1.3-7.8-1.9-11.7-1.9-11.3 0-21.9 4.8-29.3 13.3-7.2 8.3-11.2 19-11.2 30.1 0 12.3 4.9 23.7 13.3 32.1 3.1 3.1 6.6 5.8 10.3 8.2-7 7.1-16 12.3-25.9 14.7-3.7.9-7.5 1.3-11.4 1.3-13.3 0-25.7-5.3-34.6-14.5-8.8-9.1-13.7-21.4-13.7-34.1 0-14.9 6.7-28.8 18-38.5 9.8-8.3 22.4-12.9 35.4-12.9 4.8 0 9.5.6 14.1 1.8 7.3-7.9 16.9-13.8 27.5-16.4 3.3-.8 6.6-1.2 10-1.2 10.4 0 20.3 3.4 28.2 9.5 6.1 4.7 11.1 10.9 14.5 17.9 1.9-1.3 3.8-2.5 5.9-3.7-5.5-6.8-8.4-15.3-8.4-24.1 0-10 3.7-19.4 10.3-26.6C276 7.3 288.5 1.8 301.7 1.8c3 0 6.1.3 9.1.9 18.2 3.6 33.1 17.3 39.1 34.9 4.7-3 9.6-5.8 14.7-8.3-5.1-7.8-7.9-16.9-7.9-26.5 0-11.7 4-22.9 11.2-31.7 6.6-8 15.3-14 25.1-17.1 3.6-1.1 7.4-1.7 11.1-1.7 11.8 0 22.9 4.3 31.4 12.1 8.2 7.5 13.2 17.9 13.9 29.1.6 8.6-1.8 17.2-6.6 24.3 6-3.4 12.3-6.4 18.8-9 5-23.5 24.8-41.9 49.3-45.1 3.3-.4 6.6-.6 10-.6 14.7 0 28.6 5.8 39.1 15.9 10.2 9.8 16.3 23.2 17.1 37.6.8 15.7-4.4 30.8-14.3 42.4-8.3 9.7-19.2 16.7-31.3 20.2-3.3-2.4-6.8-4.7-10.4-6.7 9-3.8 17-9.8 23.2-17.4 7-8.6 10.7-19.3 10.2-30.4-.6-10-4.7-19.3-11.7-26.1z'/%3E%3C/svg%3E`
    };

    /**
     * ======================================================================================
     * SECTION 1.5: CUSTOM THEMES STORAGE
     * ======================================================================================
     */
    let customThemes = [];

    // Load custom themes from Chrome storage
    async function loadCustomThemes() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const result = await chrome.storage.sync.get(['customThemes']);
                customThemes = result.customThemes || [];
                console.log('%c✨ Loaded custom themes:', 'color: #00FF00;', customThemes.length);
            }
        } catch (error) {
            console.log('Could not load custom themes:', error.message);
            customThemes = [];
        }
    }

    // Listen for theme updates from popup
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'THEMES_UPDATED') {
                customThemes = message.themes || [];
                console.log('%c✨ Custom themes updated:', 'color: #FFD700;', customThemes.length);
                sendResponse({ success: true });
            }
            return true;
        });
    }

    // Load themes on script initialization
    loadCustomThemes();

    // --- 2. Premium CSS ---
    var css = `
        /* ============================================= */
        /* MODAL & BASE STYLES */
        /* ============================================= */
        #fcw-card-modal {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(ellipse at 50% 50%,
                rgba(10, 10, 12, 0.4) 0%,
                rgba(2, 2, 3, 0.9) 80%,
                rgba(0, 0, 0, 0.98) 100%);
            backdrop-filter: blur(40px) saturate(220%) brightness(0.6) contrast(1.1);
            -webkit-backdrop-filter: blur(40px) saturate(220%) brightness(0.6) contrast(1.1);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), background 0.8s ease, backdrop-filter 0.8s ease;
            cursor: pointer;
            overflow: hidden;
        }

        /* --- FUTMAS (CHRISTMAS) BACKGROUND & SANTA --- */
        #fcw-card-modal.futmas-active {
            /* Deep Winter Night: Dark Green to Rich Red/Black */
            background: radial-gradient(circle at 50% 30%,
                rgba(10, 50, 30, 0.6) 0%,    /* Forest Green Glow */
                rgba(60, 10, 20, 0.7) 40%,   /* Deep Crimson */
                rgba(5, 10, 15, 0.95) 80%,   /* Midnight Blue/Black */
                rgba(0, 0, 0, 1) 100%
            );
            /* Frosty Glass Effect */
            backdrop-filter: blur(35px) saturate(140%) brightness(0.9) contrast(1.1) !important;
            -webkit-backdrop-filter: blur(35px) saturate(140%) brightness(0.9) contrast(1.1) !important;
        }

        #fcw-card-modal.futmas-active::before {
            /* Festive Bokeh Light Leaks */
            background:
                radial-gradient(circle at 20% 20%, rgba(255, 0, 0, 0.15) 0%, transparent 50%), /* Red Light */
                radial-gradient(circle at 80% 80%, rgba(0, 255, 100, 0.1) 0%, transparent 50%), /* Green Light */
                radial-gradient(circle at 50% -10%, rgba(255, 215, 0, 0.15) 0%, transparent 60%) !important; /* Gold Top */
        }

        /* SANTA CONTAINER & ANIMATION */
        .fcw-santa-container {
            position: absolute;
            inset: -50%; /* Oversize to allow swooping in from outside */
            pointer-events: none;
            z-index: 150; /* Sits between card and foreground snow */
            overflow: hidden;
            transform-style: preserve-3d;
        }

        .fcw-santa-sleigh-wrapper {
            position: absolute;
            top: 50%; left: 50%;
            width: 200px; height: 85px;
            /* The cinematic swooping path */
            animation: fcw-santa-cinematic-flyby 18s cubic-bezier(0.45, 0, 0.55, 1) infinite;
            transform-origin: center center;
            will-change: transform;
        }

        .fcw-santa-sleigh-svg {
            width: 100%;
            height: 100%;
            background-image: url('${ASSETS.sleigh}');
            background-size: contain;
            background-repeat: no-repeat;
            /* Soft warm glow */
            filter: drop-shadow(0 0 8px rgba(255, 253, 208, 0.6));
        }

        @keyframes fcw-santa-cinematic-flyby {
            0% {
                opacity: 0;
                /* Start far left, high up, deep in background, banked left */
                transform: translate3d(-120vw, -40vh, -500px) scale3d(0.4, 0.4, 0.4) rotateZ(15deg) rotateY(20deg);
            }
            15% {
                opacity: 1;
            }
            40% {
                /* Swoop down near center, close to camera, level out */
                transform: translate3d(0vw, 10vh, 200px) scale3d(1.2, 1.2, 1.2) rotateZ(-5deg) rotateY(0deg);
            }
            65% {
                 /* Fly towards top right, mid-distance, slight bank right */
                transform: translate3d(80vw, -30vh, -100px) scale3d(0.7, 0.7, 0.7) rotateZ(-10deg) rotateY(-15deg);
            }
            85% { opacity: 1; }
            100% {
                opacity: 0;
                /* End far right, higher up, deep background */
                transform: translate3d(150vw, -60vh, -600px) scale3d(0.3, 0.3, 0.3) rotateZ(-15deg) rotateY(-30deg);
            }
        }


        /* --- SNOWFLAKES FOR FUTMAS --- */
        .fcw-snow-container {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 10;
            overflow: hidden;
        }

        .fcw-snowflake {
            position: absolute;
            top: -20px;
            background-color: white;
            border-radius: 50%;
            opacity: 0;
            pointer-events: none;
            will-change: transform;
            animation-name: fcw-snow-fall;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
        }

        .fcw-snowflake.shaped {
            background-color: transparent;
            background-image: url("${ASSETS.snowflake}");
            background-size: contain;
            background-repeat: no-repeat;
            border-radius: 0;
            filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.6));
        }

        @keyframes fcw-snow-fall {
            0% { transform: translate3d(var(--sway-start), -10vh, 0) rotate(0deg); opacity: 0; }
            10% { opacity: var(--max-opacity); }
            90% { opacity: var(--max-opacity); }
            100% { transform: translate3d(var(--sway-end), 110vh, 0) rotate(360deg); opacity: 0; }
        }

        /* --- HALLOWEEN BACKGROUND --- */
        #fcw-card-modal.halloween-active {
            background: radial-gradient(circle at center,
                rgba(40, 10, 50, 0.7) 0%,   /* Deep Purple */
                rgba(15, 5, 20, 0.9) 50%,   /* Very Dark Purple */
                rgba(0, 0, 0, 1) 100%       /* Black */
            );
            backdrop-filter: blur(50px) saturate(180%) contrast(1.15) !important;
            -webkit-backdrop-filter: blur(50px) saturate(180%) contrast(1.15) !important;
        }

        #fcw-card-modal.halloween-active::before {
            background:
                radial-gradient(ellipse 45% 45% at 20% 20%, rgba(255, 107, 0, 0.2) 0%, transparent 60%), /* Orange Top Left */
                radial-gradient(ellipse 40% 40% at 80% 80%, rgba(0, 255, 65, 0.15) 0%, transparent 60%),  /* Green Bottom Right */
                radial-gradient(ellipse 60% 50% at 50% -10%, rgba(138, 43, 226, 0.25) 0%, transparent 70%) !important; /* Purple Top */
        }

        /* --- BATS FOR HALLOWEEN --- */
        .fcw-bat-container {
            position: absolute;
            inset: -50%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }

        .fcw-foreground-bat-container {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 200; /* Higher than card */
            overflow: hidden;
        }

        .fcw-bat-shape {
            width: 100%;
            height: 100%;
            background-image: url("${ASSETS.bat}");
            background-repeat: no-repeat;
            background-size: contain;
            transform-origin: center center;
            animation: fcw-bat-flap-real 0.12s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
        }

        .fcw-bat-bg { position: absolute; will-change: transform; }
        .fcw-sleek-bat {
            position: absolute; top: 0; left: 0;
            z-index: 250; pointer-events: none;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.8));
            will-change: transform;
            transform: translate(-100vw, -100vh);
        }

        @keyframes fcw-bat-flap-real {
            0% { transform: scaleY(1) skewX(0deg); }
            30% { transform: scaleY(0.7); }
            100% { transform: scaleY(-0.5) skewX(15deg); }
        }

        /* Bat Flight Paths */
        @keyframes fcw-flight-swoop {
            0% { opacity: 0; transform: translate(-10vw, -10vh) scale(0.5) rotate(20deg); }
            10% { opacity: 1; }
            40% { transform: translate(40vw, 40vh) scale(0.8) rotate(40deg); }
            60% { transform: translate(60vw, 20vh) scale(0.7) rotate(0deg); }
            90% { opacity: 1; }
            100% { opacity: 0; transform: translate(110vw, 10vh) scale(0.6) rotate(-10deg); }
        }
        @keyframes fcw-flight-hunt {
            0% { opacity: 0; transform: translate(110vw, 60vh) scale(0.6) rotate(-20deg); }
            10% { opacity: 1; }
            25% { transform: translate(80vw, 20vh) scale(0.7) rotate(-40deg); }
            50% { transform: translate(50vw, 50vh) scale(0.9) rotate(10deg); }
            75% { transform: translate(20vw, 30vh) scale(0.7) rotate(-20deg); }
            90% { opacity: 1; }
            100% { opacity: 0; transform: translate(-10vw, 60vh) scale(0.6) rotate(10deg); }
        }
        @keyframes fcw-flight-dive {
            0% { opacity: 0; transform: translate(50vw, -20vh) scale(0.4); }
            20% { opacity: 1; transform: translate(50vw, 10vh) scale(0.8); }
            40% { transform: translate(55vw, 40vh) scale(1.2) rotate(10deg); }
            60% { transform: translate(45vw, 70vh) scale(0.9) rotate(-10deg); }
            100% { opacity: 0; transform: translate(50vw, 120vh) scale(0.5); }
        }
        @keyframes fcw-flight-circle {
            0% { opacity: 0; transform: translate(20vw, 20vh) rotate(0deg) scale(0.6); }
            10% { opacity: 1; }
            25% { transform: translate(80vw, 10vh) rotate(10deg) scale(0.7); }
            50% { transform: translate(90vw, 80vh) rotate(0deg) scale(0.6); }
            75% { transform: translate(10vw, 90vh) rotate(-10deg) scale(0.7); }
            90% { opacity: 1; }
            100% { opacity: 0; transform: translate(20vw, 20vh) rotate(0deg) scale(0.6); }
        }
        @keyframes fcw-flight-cross-screen {
            0% { opacity: 0; transform: translate(-20vw, 40vh) scale(0.5) rotate(15deg); }
            5% { opacity: 1; }
            50% { transform: translate(50vw, 55vh) scale(1.0) rotate(0deg); }
            95% { opacity: 1; }
            100% { opacity: 0; transform: translate(120vw, 30vh) scale(0.5) rotate(-15deg); }
        }
        @keyframes fcw-flight-panic {
            0% { opacity: 0; transform: translate(30vw, 110vh) scale(0.4); }
            10% { opacity: 1; }
            20% { transform: translate(40vw, 80vh) rotate(-45deg); }
            40% { transform: translate(30vw, 50vh) rotate(45deg) scale(0.6); }
            60% { transform: translate(60vw, 40vh) rotate(-30deg); }
            80% { transform: translate(50vw, 10vh) rotate(30deg) scale(0.5); }
            100% { opacity: 0; transform: translate(60vw, -20vh); }
        }
        @keyframes fcw-flight-loop {
            0% { opacity: 0; transform: translate(80vw, -10vh) scale(0.5); }
            15% { opacity: 1; transform: translate(70vw, 30vh) scale(0.7) rotate(20deg); }
            40% { transform: translate(50vw, 60vh) scale(0.9) rotate(90deg); }
            60% { transform: translate(30vw, 40vh) scale(0.7) rotate(180deg); }
            100% { opacity: 0; transform: translate(10vw, -10vh) scale(0.4) rotate(270deg); }
        }
        @keyframes fcw-bat-jitter {
            0% { transform: translate(0,0); }
            25% { transform: translate(5px, -5px); }
            50% { transform: translate(-3px, 3px); }
            75% { transform: translate(2px, 5px); }
            100% { transform: translate(0,0); }
        }

        .fcw-fly-swoop { animation: fcw-flight-swoop var(--flight-duration) ease-in-out infinite; }
        .fcw-fly-hunt { animation: fcw-flight-hunt var(--flight-duration) ease-in-out infinite; }
        .fcw-fly-dive { animation: fcw-flight-dive var(--flight-duration) ease-in-out infinite; }
        .fcw-fly-circle { animation: fcw-flight-circle var(--flight-duration) linear infinite; }
        .fcw-fly-cross { animation: fcw-flight-cross-screen var(--flight-duration) linear infinite; }
        .fcw-fly-panic { animation: fcw-flight-panic var(--flight-duration) ease-in-out infinite; }
        .fcw-fly-loop { animation: fcw-flight-loop var(--flight-duration) linear infinite; }


        /* ================================================= */
        /* --- FC 26 ICON (WHITE GOLD LUXURY) --- */
        /* ================================================= */

        #fcw-card-modal.icon-26-active {
            /* Softened White Background (Lower Opacity) */
            background: radial-gradient(circle at center,
                rgba(255, 255, 255, 0.85) 0%,   /* Was 0.98 */
                rgba(248, 248, 252, 0.80) 40%,  /* Was 0.95 */
                rgba(235, 235, 240, 0.75) 80%,  /* Was 0.95 */
                rgba(220, 220, 230, 0.80) 100%  /* Was 0.98 */
            );
            /* OPTIMIZATION: Reduced blur radius from 50px to 30px */
            backdrop-filter: blur(30px) saturate(100%) brightness(1.05) contrast(0.95) !important;
            -webkit-backdrop-filter: blur(30px) saturate(100%) brightness(1.05) contrast(0.95) !important;
        }

        #fcw-card-modal.icon-26-active::before {
            /* Subtle Gold Hint in corners */
            background:
                radial-gradient(ellipse 90% 90% at 50% -20%, rgba(255, 223, 0, 0.1) 0%, transparent 70%),
                radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 0% 100%, rgba(212, 175, 55, 0.15) 0%, transparent 50%) !important;
            opacity: 1 !important;
        }

        /* Change Text Color for White Background */
        #fcw-card-modal.icon-26-active .fcw-modal-hint {
            color: rgba(140, 110, 50, 0.8) !important;
            text-shadow: none !important;
            font-weight: 600;
        }

        #fcw-card-modal.icon-26-active .fcw-lock-indicator {
            background: rgba(255, 255, 255, 0.5);
            border: 1px solid rgba(184, 134, 11, 0.4);
            color: rgba(184, 134, 11, 1);
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        /* GOD RAYS REMOVED for Cleaner Look */

        /* ================================================= */

        /* God Ray Animation Base (Still used for other potential effects but not Icon 26) */
        .fcw-god-ray {
            position: absolute;
            width: 150%;
            height: 150%;
            background: conic-gradient(
                from 0deg at 50% 50%,
                transparent 0deg,
                rgba(255, 223, 0, 0.05) 15deg,
                transparent 30deg,
                rgba(255, 255, 200, 0.03) 45deg,
                transparent 60deg
            );
            top: -25%; left: -25%;
            z-index: -5;
            pointer-events: none;
            animation: fcw-ray-spin 20s linear infinite;
            opacity: 0.6;
        }

        @keyframes fcw-ray-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }


        /* --- GOLD DREAM TEAM BACKGROUND --- */
        #fcw-card-modal.dream-active {
            background: radial-gradient(ellipse farthest-corner at center,
                rgba(255, 232, 115, 0.5) 0%,
                rgba(255, 215, 0, 0.4) 20%,
                rgba(218, 165, 32, 0.4) 45%,
                rgba(184, 134, 11, 0.5) 70%,
                rgba(80, 50, 20, 0.9) 100%
            );
            backdrop-filter: blur(60px) saturate(160%) brightness(0.75) contrast(1.05) !important;
            -webkit-backdrop-filter: blur(60px) saturate(160%) brightness(0.75) contrast(1.05) !important;
        }

        #fcw-card-modal.dream-active::before {
            background:
                radial-gradient(ellipse 50% 50% at 50% -10%, rgba(255, 245, 180, 0.3) 0%, transparent 70%),
                radial-gradient(ellipse 40% 40% at 0% 100%, rgba(255, 170, 50, 0.25) 0%, transparent 60%),
                radial-gradient(ellipse 40% 40% at 100% 100%, rgba(255, 210, 80, 0.25) 0%, transparent 60%) !important;
        }

        /* --- SILVER DREAM TEAM BACKGROUND --- */
        #fcw-card-modal.silver-active {
            background: radial-gradient(ellipse farthest-corner at center,
                rgba(255, 255, 255, 0.5) 0%,
                rgba(220, 220, 220, 0.4) 20%,
                rgba(160, 160, 160, 0.4) 45%,
                rgba(119, 136, 153, 0.5) 70%,
                rgba(40, 45, 55, 0.9) 100%
            );
            backdrop-filter: blur(60px) saturate(110%) brightness(0.85) contrast(1.1) !important;
            -webkit-backdrop-filter: blur(60px) saturate(110%) brightness(0.85) contrast(1.1) !important;
        }

        #fcw-card-modal.silver-active::before {
            background:
                radial-gradient(ellipse 50% 50% at 50% -10%, rgba(255, 255, 255, 0.4) 0%, transparent 70%),
                radial-gradient(ellipse 40% 40% at 0% 100%, rgba(200, 200, 220, 0.25) 0%, transparent 60%),
                radial-gradient(ellipse 40% 40% at 100% 100%, rgba(180, 180, 200, 0.25) 0%, transparent 60%) !important;
        }

        /* --- BRONZE DREAM TEAM BACKGROUND --- */
        #fcw-card-modal.bronze-active {
            background: radial-gradient(ellipse farthest-corner at center,
                rgba(113, 69, 57, 0.5) 0%,
                rgba(113, 69, 57, 0.4) 20%,
                rgba(80, 50, 40, 0.4) 45%,
                rgba(60, 35, 30, 0.5) 70%,
                rgba(30, 15, 10, 0.9) 100%
            );
            backdrop-filter: blur(60px) saturate(130%) brightness(0.8) contrast(1.1) !important;
            -webkit-backdrop-filter: blur(60px) saturate(130%) brightness(0.8) contrast(1.1) !important;
        }

        #fcw-card-modal.bronze-active::before {
            background:
                radial-gradient(ellipse 50% 50% at 50% -10%, rgba(200, 150, 140, 0.3) 0%, transparent 70%),
                radial-gradient(ellipse 40% 40% at 0% 100%, rgba(113, 69, 57, 0.3) 0%, transparent 60%),
                radial-gradient(ellipse 40% 40% at 100% 100%, rgba(140, 90, 80, 0.3) 0%, transparent 60%) !important;
        }

        /* --- FW ICON (RED/BLACK/GOLD) BACKGROUND --- */
        #fcw-card-modal.fw-icon-active {
            background: radial-gradient(circle at center,
                rgba(80, 0, 0, 0.5) 0%,
                rgba(40, 0, 0, 0.8) 35%,
                rgba(10, 0, 0, 0.95) 70%,
                rgba(0, 0, 0, 1) 100%
            );
            backdrop-filter: blur(40px) saturate(140%) brightness(0.7) contrast(1.2) !important;
            -webkit-backdrop-filter: blur(40px) saturate(140%) brightness(0.7) contrast(1.2) !important;
        }

        #fcw-card-modal.fw-icon-active::before {
            background:
                radial-gradient(ellipse 60% 50% at 50% -10%, rgba(255, 0, 0, 0.2) 0%, transparent 70%),
                radial-gradient(ellipse 40% 40% at 0% 100%, rgba(255, 215, 0, 0.1) 0%, transparent 60%),
                radial-gradient(ellipse 40% 40% at 100% 100%, rgba(200, 0, 0, 0.15) 0%, transparent 60%) !important;
        }

        /* --- RIBBON EFFECTS (Shared Animation) --- */
        .fcw-ribbon-container {
            position: absolute;
            inset: -50%;
            pointer-events: none;
            z-index: 0;
            transform-style: preserve-3d;
            overflow: hidden;
            /* FPS Fix: Force new stacking context */
            transform: translateZ(0);
        }

        .fcw-ribbon {
            position: absolute;
            opacity: 0.6;
            mix-blend-mode: hard-light;
            animation: fcw-ribbon-flow 8s infinite linear;
            /* FPS Fix: Hardware acceleration */
            will-change: transform;
        }

        /* FW ICON Ribbons */
        .fcw-ribbon.gold {
            background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), transparent);
            height: 150px;
            width: 200%;
            filter: blur(20px);
            transform: rotate(-35deg) translateY(-100px);
        }
        .fcw-ribbon.red {
            background: linear-gradient(90deg, transparent, rgba(200, 0, 0, 0.8), transparent);
            height: 200px;
            width: 200%;
            filter: blur(20px);
            animation-duration: 12s;
            animation-direction: reverse;
            transform: rotate(-35deg) translateY(100px);
        }
        .fcw-ribbon.thin-gold {
            background: linear-gradient(90deg, transparent, rgba(255, 255, 200, 0.9), transparent);
            height: 10px;
            width: 200%;
            filter: blur(4px);
            animation-duration: 5s;
            transform: rotate(-35deg);
            mix-blend-mode: overlay;
        }

        /* --- NEW: WHITE GOLD RIBBONS (FC 26 ICON) - OPTIMIZED --- */
        /* FPS FIX: REDUCED BLUR RADIUS & ADDED WILL-CHANGE */
        .fcw-ribbon.white-gold {
            background: linear-gradient(90deg, transparent, rgba(230, 230, 230, 0.6), rgba(255, 255, 255, 0.9), rgba(230, 230, 230, 0.6), transparent);
            height: 250px;
            width: 250%;
            mix-blend-mode: soft-light;
            filter: blur(1px); /* Reduced from 4px to 1px for performance */
            transform: rotate(-30deg) translateY(-80px);
            opacity: 0.7;
        }

        .fcw-ribbon.pure-gold {
            background: linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.4), rgba(255, 215, 0, 0.8), rgba(218, 165, 32, 0.4), transparent);
            height: 180px;
            width: 250%;
            mix-blend-mode: normal;
            filter: blur(1px); /* Reduced from 2px to 1px */
            animation-direction: reverse;
            transform: rotate(-30deg) translateY(80px);
            opacity: 0.8;
        }

        .fcw-ribbon.platinum {
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
            height: 60px;
            width: 250%;
            mix-blend-mode: overlay;
            filter: blur(0px); /* Removed blur for performance */
            transform: rotate(-30deg);
            opacity: 0.9;
        }

        @keyframes fcw-ribbon-flow {
            0% { transform: rotate(-35deg) translate(-10%, -10%); }
            100% { transform: rotate(-35deg) translate(10%, 10%); }
        }

        /* ============================================= */
        /* 1920s AUTHENTIC VINTAGE FILM EFFECT */
        /* ============================================= */
        #fcw-card-modal.vintage-active {
            background: radial-gradient(ellipse at 50% 50%,
                rgba(25, 20, 15, 0.9) 0%,
                rgba(15, 12, 8, 0.95) 50%,
                rgba(5, 3, 0, 1) 100%
            );
            backdrop-filter: blur(20px) saturate(30%) brightness(0.4) contrast(1.3) !important;
            -webkit-backdrop-filter: blur(20px) saturate(30%) brightness(0.4) contrast(1.3) !important;
        }

        .fcw-vintage-filter-layer {
            filter: sepia(1) saturate(0.4) contrast(1.25) brightness(0.85);
            animation: fcw-film-flicker 0.1s steps(2) infinite;
        }

        @keyframes fcw-film-flicker {
            0% { filter: sepia(1) saturate(0.4) contrast(1.25) brightness(0.85); }
            25% { filter: sepia(1) saturate(0.4) contrast(1.25) brightness(0.82); }
            50% { filter: sepia(1) saturate(0.4) contrast(1.25) brightness(0.88); }
            75% { filter: sepia(1) saturate(0.4) contrast(1.25) brightness(0.80); }
            100% { filter: sepia(1) saturate(0.4) contrast(1.25) brightness(0.86); }
        }

        #fcw-card-modal.vintage-active::before {
            background:
                radial-gradient(ellipse 80% 60% at 50% 50%, rgba(150, 120, 70, 0.12) 0%, transparent 60%),
                radial-gradient(ellipse 30% 30% at 15% 85%, rgba(100, 70, 30, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse 30% 30% at 85% 85%, rgba(80, 60, 25, 0.08) 0%, transparent 50%) !important;
        }

        #fcw-card-modal.vintage-active .fcw-card-stage {
            animation: fcw-projector-shake 0.15s steps(1) infinite;
        }

        @keyframes fcw-projector-shake {
            0% { transform: translate(0, 0); }
            10% { transform: translate(0.5px, -1px); }
            20% { transform: translate(-1px, 0.5px); }
            30% { transform: translate(0, 0); }
            40% { transform: translate(0.5px, 0.5px); }
            50% { transform: translate(-0.5px, -0.5px); }
            60% { transform: translate(0, 0); }
            70% { transform: translate(1px, 0); }
            80% { transform: translate(-0.5px, 0.5px); }
            90% { transform: translate(0, -0.5px); }
            100% { transform: translate(0, 0); }
        }

        /* --- HEAVY FILM GRAIN --- */
        .fcw-film-grain {
            position: fixed;
            top: -50%; left: -50%;
            width: 200%; height: 200%;
            pointer-events: none;
            z-index: 1000010;
            opacity: 0.25;
            background-image: url("${ASSETS.heavyGrain}");
            background-size: 200px 200px;
            animation: fcw-grain-animate 0.05s steps(1) infinite;
            mix-blend-mode: multiply;
        }

        @keyframes fcw-grain-animate {
            0% { transform: translate(0, 0); }
            20% { transform: translate(-5%, -5%); }
            40% { transform: translate(5%, 5%); }
            60% { transform: translate(-2%, 3%); }
            80% { transform: translate(3%, -2%); }
            100% { transform: translate(0, 0); }
        }

        .fcw-film-grain-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            pointer-events: none;
            z-index: 1000011;
            opacity: 0.15;
            background-image: url("${ASSETS.noise}");
            background-size: 100px 100px;
            animation: fcw-grain-overlay 0.08s steps(1) infinite;
            mix-blend-mode: overlay;
        }

        @keyframes fcw-grain-overlay {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-3px, 2px) scale(1.01); }
            66% { transform: translate(2px, -3px) scale(0.99); }
            100% { transform: translate(0, 0) scale(1); }
        }

        .fcw-vignette-vintage {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            pointer-events: none;
            z-index: 1000001;
            background: radial-gradient(ellipse at center,
                transparent 20%,
                rgba(0, 0, 0, 0.2) 50%,
                rgba(0, 0, 0, 0.6) 80%,
                rgba(0, 0, 0, 0.9) 100%
            );
        }

        .fcw-film-artifacts {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            pointer-events: none;
            z-index: 1000005;
            overflow: hidden;
        }

        .fcw-film-hair {
            position: absolute;
            background: rgba(20, 15, 10, 0.7);
            transform-origin: center center;
            border-radius: 50% / 10%;
            opacity: 0;
            animation: fcw-hair-appear var(--duration) ease-in-out infinite;
            animation-delay: var(--delay);
        }

        @keyframes fcw-hair-appear {
            0%, 100% { opacity: 0; }
            5% { opacity: 0.8; }
            15% { opacity: 0.8; }
            20% { opacity: 0; }
        }

        .fcw-dust-blob {
            position: absolute;
            background: radial-gradient(ellipse at center,
                rgba(30, 25, 15, 0.9) 0%,
                rgba(30, 25, 15, 0.5) 50%,
                transparent 70%
            );
            border-radius: 50%;
            opacity: 0;
            animation: fcw-blob-flicker var(--flicker-time) steps(1) infinite;
            animation-delay: var(--delay);
        }

        @keyframes fcw-blob-flicker {
            0%, 100% { opacity: 0; }
            3% { opacity: 0.9; }
            6% { opacity: 0; }
            50% { opacity: 0; }
            53% { opacity: 0.7; }
            56% { opacity: 0; }
        }

        .fcw-white-speck {
            position: absolute;
            background: rgba(255, 250, 230, 0.9);
            border-radius: 50%;
            opacity: 0;
            animation: fcw-speck-flash var(--flash-time) steps(1) infinite;
            animation-delay: var(--delay);
        }

        @keyframes fcw-speck-flash {
            0%, 100% { opacity: 0; }
            2% { opacity: 1; }
            4% { opacity: 0; }
            60% { opacity: 0; }
            62% { opacity: 0.8; }
            64% { opacity: 0; }
        }

        .fcw-cigarette-burn {
            position: fixed;
            top: 10%;
            right: 10%;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: radial-gradient(circle at center,
                rgba(255, 250, 220, 0.95) 0%,
                rgba(255, 240, 180, 0.8) 30%,
                rgba(200, 150, 50, 0.4) 60%,
                transparent 70%
            );
            opacity: 0;
            z-index: 1000012;
            pointer-events: none;
            animation: fcw-burn-flash 12s ease-in-out infinite;
        }

        @keyframes fcw-burn-flash {
            0%, 100% { opacity: 0; transform: scale(0.8); }
            48% { opacity: 0; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1); }
            52% { opacity: 1; transform: scale(1.1); }
            54% { opacity: 0; transform: scale(0.9); }
        }

        .fcw-light-leak {
            position: fixed;
            pointer-events: none;
            z-index: 1000003;
            opacity: 0;
            filter: blur(30px);
            animation: fcw-leak-pulse var(--pulse-time) ease-in-out infinite;
            animation-delay: var(--delay);
        }

        @keyframes fcw-leak-pulse {
            0%, 100% { opacity: 0; }
            45% { opacity: 0; }
            50% { opacity: var(--max-opacity); }
            55% { opacity: 0; }
        }

        .fcw-frame-line {
            position: fixed;
            top: 0;
            height: 100%;
            width: 2px;
            background: linear-gradient(to bottom,
                transparent 0%,
                rgba(255, 250, 230, 0.1) 20%,
                rgba(255, 250, 230, 0.05) 50%,
                rgba(255, 250, 230, 0.1) 80%,
                transparent 100%
            );
            pointer-events: none;
            z-index: 1000002;
            opacity: 0.5;
        }

        .fcw-emulsion-scratch {
            position: absolute;
            background: linear-gradient(90deg,
                transparent 0%,
                rgba(255, 250, 240, 0.4) 45%,
                rgba(255, 250, 240, 0.6) 50%,
                rgba(255, 250, 240, 0.4) 55%,
                transparent 100%
            );
            height: 100%;
            width: 1px;
            opacity: 0;
            animation: fcw-scratch-flicker var(--scratch-time) steps(1) infinite;
            animation-delay: var(--delay);
        }

        @keyframes fcw-scratch-flicker {
            0%, 100% { opacity: 0; }
            1% { opacity: 0.6; }
            2% { opacity: 0; }
            30% { opacity: 0; }
            31% { opacity: 0.4; }
            32% { opacity: 0; }
            70% { opacity: 0; }
            71% { opacity: 0.5; }
            72% { opacity: 0; }
        }

        .fcw-water-stain {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(ellipse at center,
                rgba(60, 50, 30, 0.3) 0%,
                rgba(60, 50, 30, 0.15) 40%,
                transparent 70%
            );
            opacity: 0;
            animation: fcw-stain-appear var(--stain-time) ease-in-out infinite;
            animation-delay: var(--delay);
        }

        @keyframes fcw-stain-appear {
            0%, 100% { opacity: 0; }
            40% { opacity: 0; }
            45% { opacity: 0.6; }
            55% { opacity: 0.6; }
            60% { opacity: 0; }
        }

        .fcw-sprocket-edge {
            position: fixed;
            top: 0;
            height: 100%;
            width: 20px;
            background: repeating-linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.95) 0px,
                rgba(0, 0, 0, 0.95) 15px,
                rgba(20, 15, 10, 0.9) 15px,
                rgba(20, 15, 10, 0.9) 25px
            );
            pointer-events: none;
            z-index: 1000000;
            animation: fcw-sprocket-jitter 0.2s steps(1) infinite;
        }

        .fcw-sprocket-edge.left {
            left: 0;
            transform-origin: left center;
        }

        .fcw-sprocket-edge.right {
            right: 0;
            transform-origin: right center;
        }

        @keyframes fcw-sprocket-jitter {
            0% { opacity: 0.3; transform: translateX(0); }
            25% { opacity: 0.5; transform: translateX(-2px); }
            50% { opacity: 0.2; transform: translateX(1px); }
            75% { opacity: 0.4; transform: translateX(-1px); }
            100% { opacity: 0.3; transform: translateX(0); }
        }

        .fcw-shutter-blackout {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 1);
            pointer-events: none;
            z-index: 1000020;
            opacity: 0;
            animation: fcw-shutter 0.08s steps(1) infinite;
        }

        @keyframes fcw-shutter {
            0%, 100% { opacity: 0; }
            50% { opacity: 0.03; }
        }

        .fcw-projector-hotspot {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 120%;
            height: 120%;
            background: radial-gradient(ellipse at center,
                rgba(255, 250, 220, 0.08) 0%,
                transparent 50%
            );
            pointer-events: none;
            z-index: 1000004;
            animation: fcw-hotspot-flicker 0.2s ease-in-out infinite;
        }

        @keyframes fcw-hotspot-flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
        }

        /* ----------------------------------------------------- */
        /* STANDARD STYLES BELOW */
        /* ----------------------------------------------------- */

        #fcw-card-modal::after {
            content: "";
            position: absolute;
            inset: 0;
            opacity: 0.04;
            pointer-events: none;
            z-index: -1;
            background-image: url("${ASSETS.noise}");
            mix-blend-mode: overlay;
        }

        #fcw-card-modal.active {
            opacity: 1;
            pointer-events: auto;
        }

        #fcw-card-modal::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background:
                radial-gradient(ellipse 60% 60% at 50% -20%, rgba(255, 255, 255, 0.05) 0%, transparent 60%),
                radial-gradient(ellipse 40% 40% at 20% 90%, rgba(100, 200, 255, 0.02) 0%, transparent 50%),
                radial-gradient(ellipse 40% 40% at 80% 90%, rgba(255, 150, 100, 0.02) 0%, transparent 50%);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.8s ease 0.2s, background 0.8s ease;
            z-index: 0;
        }

        #fcw-card-modal.active::before {
             opacity: 1;
        }

        .fcw-ambient-particles {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 1;
            perspective: 1000px;
        }

        .fcw-card-stage {
            perspective: 2000px;
            perspective-origin: 50% 50%;
            position: relative;
            cursor: default;
            z-index: 100;
        }

        .fcw-3d-card {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.08s ease-out;
            will-change: transform;
        }

        .fcw-card-wrapper {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            border-radius: 16px;
            overflow: visible;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .fcw-cloned-card {
            position: relative !important;
            margin: 0 !important;
            transform-style: preserve-3d !important;
            border-radius: 16px;
            overflow: visible !important;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: high-quality;
            transform: translateZ(0);
            will-change: transform;
        }

        .fcw-cloned-card * {
            transform-style: preserve-3d !important;
            backface-visibility: hidden;
        }

        .fcw-cloned-card {
            animation: fcw-card-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fcw-card-reveal {
            0% {
                opacity: 0;
                transform: scale(0.9) translateZ(0) rotateX(5deg);
                filter: blur(8px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateZ(0) rotateX(0deg);
                filter: blur(0);
            }
        }

        #fcw-card-modal.vintage-active .fcw-cloned-card {
            animation: fcw-card-reveal-vintage 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fcw-card-reveal-vintage {
            0% {
                opacity: 0;
                transform: scale(0.9) translateZ(0) rotateX(5deg);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateZ(0) rotateX(0deg);
            }
        }

        /* ============================================= */
        /* 3D LAYER SYSTEM */
        /* ============================================= */
        .fcw-layer-player-dynamic {
            transform: translateZ(60px) scale(0.88) !important;
            filter:
                drop-shadow(0 5px 15px rgba(0,0,0,0.4))
                drop-shadow(0 15px 35px rgba(0,0,0,0.6)) !important;
            z-index: 20;
            transition: transform 0.15s ease-out, filter 0.15s ease-out;
        }

        .fcw-layer-icon-pop {
            transform: translateZ(30px) !important;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4)) !important;
            z-index: 10;
        }

        .fcw-layer-flat {
            transform: translateZ(0px) !important;
            filter: none !important;
            z-index: 5;
        }

        .fcw-layer-base {
            transform: translateZ(0px) !important;
            z-index: 1;
        }

        /* ============================================= */
        /* SCINTILLATION EFFECT */
        /* ============================================= */
        .fcw-scintillation-field {
            position: absolute;
            inset: -20px;
            border-radius: 16px;
            z-index: 60;
            pointer-events: none;
            transform: translateZ(85px);
            mix-blend-mode: color-dodge;
            overflow: visible;
            will-change: transform;
        }

        .fcw-scintilla-star {
            position: absolute;
            width: var(--dims);
            height: var(--dims);
            clip-path: polygon(50% 0%, 53% 42%, 100% 50%, 53% 58%, 50% 100%, 47% 58%, 0% 50%, 47% 42%);
            /* Default Gold */
            background: radial-gradient(circle at center, #ffffff 0%, #fffbf0 20%, #f0e68c 60%, transparent 70%);
            opacity: 0;
            transform-origin: center center;
            animation: fcw-flash-sleek var(--duration) cubic-bezier(0.25, 1, 0.5, 1) infinite;
            animation-delay: var(--delay);
            transform: rotate(var(--rot));
        }

        /* Silver Star Variant */
        #fcw-card-modal.silver-active .fcw-scintilla-star {
            background: radial-gradient(circle at center, #ffffff 0%, #f0f0f5 20%, #c0c0d0 60%, transparent 70%) !important;
        }

        /* Bronze Star Variant (#714539 theme) */
        #fcw-card-modal.bronze-active .fcw-scintilla-star {
            background: radial-gradient(circle at center, #ffffff 0%, #ecdcd9 20%, #714539 60%, transparent 70%) !important;
        }

        /* FW Icon Star Variant (Gold with Red Hint) */
        #fcw-card-modal.fw-icon-active .fcw-scintilla-star {
             background: radial-gradient(circle at center, #ffffff 0%, #fff0f0 20%, #ffd700 60%, transparent 70%) !important;
        }

        /* FC 26 Icon Star Variant (High Brightness Champagne) */
        #fcw-card-modal.icon-26-active .fcw-scintilla-star {
             background: radial-gradient(circle at center, #ffffff 0%, #fffee0 20%, #ffd700 60%, transparent 70%) !important;
             filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.8));
        }

        /* Futmas Star Variant (Snowy White/Gold) */
        #fcw-card-modal.futmas-active .fcw-scintilla-star {
             background: radial-gradient(circle at center, #ffffff 0%, #e0fff4 20%, #ffd700 60%, transparent 70%) !important;
             filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.9));
        }

        @keyframes fcw-flash-sleek {
            0% { opacity: 0; transform: scale(0) rotate(var(--rot)); }
            10% { opacity: var(--intensity, 1); transform: scale(1.1) rotate(var(--rot)); }
            100% { opacity: 0; transform: scale(0.2) rotate(var(--rot)); }
        }

        /* ============================================= */
        /* PREMIUM EFFECTS */
        /* ============================================= */
        .fcw-particle-ember {
            position: absolute;
            bottom: -20px;
            width: 2px;
            height: 2px;
            background: radial-gradient(circle, #fff 40%, transparent 100%);
            border-radius: 50%;
            opacity: 0;
            z-index: 10;
            pointer-events: none;
            animation: fcw-ember-rise var(--rise-duration) ease-out infinite;
            animation-delay: var(--rise-delay);
            will-change: transform, opacity;
        }

        /* FW Icon Ember Colors */
        #fcw-card-modal.fw-icon-active .fcw-particle-ember.fw-red {
            background: radial-gradient(circle, #ff4040 30%, transparent 100%);
            width: 3px; height: 3px;
            box-shadow: 0 0 4px rgba(255,0,0,0.5);
        }
        #fcw-card-modal.fw-icon-active .fcw-particle-ember.fw-gold {
            background: radial-gradient(circle, #ffd700 30%, transparent 100%);
            box-shadow: 0 0 4px rgba(255,215,0,0.5);
        }

        /* Halloween Ember Colors */
        #fcw-card-modal.halloween-active .fcw-particle-ember.h-orange {
            background: radial-gradient(circle, #ff6b00 30%, transparent 100%);
            width: 3px; height: 3px;
            box-shadow: 0 0 5px rgba(255,107,0,0.6);
        }
        #fcw-card-modal.halloween-active .fcw-particle-ember.h-purple {
            background: radial-gradient(circle, #9d00ff 30%, transparent 100%);
            width: 3px; height: 3px;
            box-shadow: 0 0 5px rgba(157,0,255,0.6);
        }
        #fcw-card-modal.halloween-active .fcw-particle-ember.h-green {
            background: radial-gradient(circle, #00ff41 30%, transparent 100%);
            width: 2px; height: 2px;
            box-shadow: 0 0 5px rgba(0,255,65,0.6);
        }

        /* FC 26 ICON LUXURY EMBERS (Darker to show on White) */
        #fcw-card-modal.icon-26-active .fcw-particle-ember.i26-gold {
            background: radial-gradient(circle, #B8860B 40%, transparent 100%);
            width: 3px; height: 3px;
            box-shadow: none;
        }
        #fcw-card-modal.icon-26-active .fcw-particle-ember.i26-white {
            background: radial-gradient(circle, #fff 40%, transparent 100%);
            width: 2px; height: 2px;
            box-shadow: 0 0 2px rgba(0,0,0,0.1);
            mix-blend-mode: multiply;
        }
        #fcw-card-modal.icon-26-active .fcw-particle-ember.i26-champagne {
            background: radial-gradient(circle, #DAA520 40%, transparent 100%);
            width: 2px; height: 2px;
            box-shadow: none;
        }

        /* FUTMAS Sparkles (Red & Green) */
        #fcw-card-modal.futmas-active .fcw-particle-ember.fcw-sparkle-red {
            background: radial-gradient(circle, #ff0033 40%, transparent 100%);
            width: 3px; height: 3px;
            box-shadow: 0 0 4px rgba(255,0,51,0.6);
        }
        #fcw-card-modal.futmas-active .fcw-particle-ember.fcw-sparkle-green {
            background: radial-gradient(circle, #00ff66 40%, transparent 100%);
            width: 2px; height: 2px;
            box-shadow: 0 0 4px rgba(0,255,102,0.6);
        }

        @keyframes fcw-ember-rise {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            20% { opacity: var(--max-opacity); }
            100% { transform: translateY(-80vh) translateX(var(--drift)); opacity: 0; }
        }

        .fcw-effect-radiance {
            position: absolute;
            inset: -20px;
            z-index: -10;
            border-radius: 40px;
            background: conic-gradient(
                from var(--rotation-offset, 0deg),
                transparent 0deg,
                rgba(255, 255, 255, 0.1) 60deg,
                rgba(255, 255, 255, 0.3) 100deg,
                rgba(255, 255, 255, 0.1) 140deg,
                transparent 220deg
            );
            filter: blur(35px);
            transform: translateZ(-5px);
            animation: fcw-radiance-spin 12s linear infinite;
            opacity: 0.5;
            pointer-events: none;
            will-change: transform;
        }

        @keyframes fcw-radiance-spin {
            0% { transform: translateZ(-5px) rotate(0deg); }
            100% { transform: translateZ(-5px) rotate(360deg); }
        }

        .fcw-effect-ultra-shadow {
            position: absolute;
            inset: 10%;
            border-radius: 20px;
            background: rgba(0, 0, 0, 0.8);
            filter: blur(45px);
            z-index: -20;
            pointer-events: none;
            transform: translateZ(-60px) translateY(30px);
            opacity: 1;
        }

        .fcw-effect-particles {
            position: absolute;
            inset: 0;
            border-radius: 16px;
            overflow: hidden;
            z-index: 40;
            pointer-events: none;
            transform: translateZ(72px);
        }

        .fcw-particle {
            position: absolute;
            width: var(--size, 2px);
            height: var(--size, 2px);
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            animation: fcw-particle-float var(--duration, 4s) ease-in-out infinite;
            animation-delay: var(--delay, 0s);
            will-change: transform, opacity;
        }

        @keyframes fcw-particle-float {
            0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
            50% { opacity: 1; }
            100% { opacity: 0; transform: translateY(-80px) scale(1); }
        }

        .fcw-effect-standard-shadow {
            position: absolute;
            inset: 8%;
            border-radius: 16px;
            background: rgba(0, 0, 0, 0.5);
            filter: blur(35px);
            z-index: -2;
            pointer-events: none;
            transform: translateZ(-20px) translateY(25px);
        }

        /* UI Hints */
        .fcw-modal-hint {
            position: absolute;
            bottom: 40px;
            color: rgba(255, 255, 255, 0.4);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 4px;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1000030;
        }

        #fcw-card-modal.vintage-active .fcw-modal-hint {
            color: rgba(180, 160, 120, 0.6);
            font-family: 'Times New Roman', Georgia, serif;
            letter-spacing: 6px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .fcw-modal-hint span { opacity: 0.5; margin: 0 8px; }

        .fcw-lock-indicator {
            position: absolute;
            top: 40px; right: 40px;
            padding: 6px 14px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            color: rgba(255, 255, 255, 0.8);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            pointer-events: none;
            z-index: 1000030;
        }

        #fcw-card-modal.vintage-active .fcw-lock-indicator {
            background: rgba(80, 60, 30, 0.4);
            border: 1px solid rgba(120, 100, 60, 0.3);
            color: rgba(200, 180, 140, 0.9);
            font-family: 'Times New Roman', Georgia, serif;
        }

        #fcw-card-modal.halloween-active .fcw-lock-indicator {
            background: rgba(100, 0, 150, 0.3);
            border: 1px solid rgba(180, 50, 255, 0.3);
            color: rgba(230, 200, 255, 0.9);
        }

        #fcw-card-modal.futmas-active .fcw-lock-indicator {
            background: rgba(0, 50, 20, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.9);
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.1);
        }

        .fcw-lock-indicator.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // --- 3. Create Modal HTML ---
    var modal = document.createElement('div');
    modal.id = 'fcw-card-modal';

    // Container for Bat effects (Background)
    var batContainer = document.createElement('div');
    batContainer.className = 'fcw-bat-container';
    batContainer.id = 'fcw-bat-container';
    modal.appendChild(batContainer);

    // Container for Snow effects (Background/Foreground)
    var snowContainer = document.createElement('div');
    snowContainer.className = 'fcw-snow-container';
    snowContainer.id = 'fcw-snow-container';
    modal.appendChild(snowContainer);

    // Container for Santa Sleigh (Background/Foreground Layering)
    var santaContainer = document.createElement('div');
    santaContainer.className = 'fcw-santa-container';
    santaContainer.id = 'fcw-santa-container';
    modal.appendChild(santaContainer);

    // NEW: Container for Foreground Bats (Detached from card to avoid clutter/clipping)
    var foregroundBatContainer = document.createElement('div');
    foregroundBatContainer.className = 'fcw-foreground-bat-container';
    foregroundBatContainer.id = 'fcw-foreground-bat-container';
    modal.appendChild(foregroundBatContainer);

    // Container for Ribbon effects (FW Icon)
    var ribbonContainer = document.createElement('div');
    ribbonContainer.className = 'fcw-ribbon-container';
    ribbonContainer.id = 'fcw-ribbon-container';
    modal.appendChild(ribbonContainer);

    var ambientParticles = document.createElement('div');
    ambientParticles.className = 'fcw-ambient-particles';
    modal.appendChild(ambientParticles);

    var stageDiv = document.createElement('div');
    stageDiv.className = 'fcw-card-stage';
    stageDiv.id = 'fcw-stage';

    var containerDiv = document.createElement('div');
    containerDiv.className = 'fcw-3d-card';
    containerDiv.id = 'fcw-card-container';

    var wrapperDiv = document.createElement('div');
    wrapperDiv.className = 'fcw-card-wrapper';
    wrapperDiv.id = 'fcw-card-wrapper';

    var hintDiv = document.createElement('div');
    hintDiv.className = 'fcw-modal-hint';
    hintDiv.innerHTML = 'Click to Lock<span>·</span>ESC to Close';

    var lockIndicator = document.createElement('div');
    lockIndicator.className = 'fcw-lock-indicator';
    lockIndicator.id = 'fcw-lock-indicator';
    lockIndicator.textContent = 'Locked';

    containerDiv.appendChild(wrapperDiv);
    stageDiv.appendChild(containerDiv);
    modal.appendChild(stageDiv);
    modal.appendChild(hintDiv);
    modal.appendChild(lockIndicator);
    document.body.appendChild(modal);

    var stage = stageDiv;
    var container = containerDiv;
    var wrapper = wrapperDiv;

    var vintageEffectsActive = false;

    // --- 4. Interaction Logic ---
    var isPaused = false;
    var currentCard = null;

    modal.addEventListener('click', function (e) {
        // Add santaContainer to ignored click targets
        if (e.target === modal || e.target.classList.contains('fcw-modal-hint') || e.target.classList.contains('fcw-ambient-particles') || e.target.classList.contains('fcw-bat-container') || e.target.classList.contains('fcw-snow-container') || e.target.classList.contains('fcw-santa-container')) {
            closeModal();
        } else {
            isPaused = !isPaused;
            lockIndicator.classList.toggle('visible', isPaused);
            lockIndicator.textContent = isPaused ? 'Locked' : 'Unlocked';
            if (isPaused) {
                container.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            } else {
                container.style.transition = 'transform 0.08s ease-out';
                setTimeout(function () {
                    lockIndicator.classList.remove('visible');
                }, 1000);
            }
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('active', 'dream-active', 'silver-active', 'bronze-active', 'vintage-active', 'fw-icon-active', 'halloween-active', 'icon-26-active', 'futmas-active');
        container.style.transform = 'rotateX(0deg) rotateY(0deg)';
        wrapper.innerHTML = '';
        ambientParticles.innerHTML = '';
        ribbonContainer.innerHTML = ''; // Clear ribbons
        batContainer.innerHTML = ''; // Clear background bats
        foregroundBatContainer.innerHTML = ''; // Clear foreground bats
        snowContainer.innerHTML = ''; // Clear snow
        santaContainer.innerHTML = ''; // Clear santa
        isPaused = false;
        currentCard = null;
        lockIndicator.classList.remove('visible');
        removeVintageEffects();
    }

    // --- Ribbon Effects Creation (FW Icon) ---
    function createRibbonEffects() {
        // 1. Gold Ribbon
        var goldRibbon = document.createElement('div');
        goldRibbon.className = 'fcw-ribbon gold';
        ribbonContainer.appendChild(goldRibbon);

        // 2. Red Ribbon
        var redRibbon = document.createElement('div');
        redRibbon.className = 'fcw-ribbon red';
        ribbonContainer.appendChild(redRibbon);

        // 3. Thin Gold Accent
        var thinGold = document.createElement('div');
        thinGold.className = 'fcw-ribbon thin-gold';
        ribbonContainer.appendChild(thinGold);
    }

    // --- NEW: White Gold Ribbons for FC 26 (OPTIMIZED & STATIC) ---
    function createIcon26Ribbons() {
        // FPS FIX: Reduced from 25 to 12 (Slightly larger ribbons to compensate)
        for (var i = 0; i < 12; i++) {
            var ribbon = document.createElement('div');

            // Alternate types (Heavy on Pure Gold)
            var type = (i % 3 === 0) ? 'white-gold' : (i % 3 === 1) ? 'pure-gold' : 'platinum';
            ribbon.className = 'fcw-ribbon ' + type;

            // FORCE STATIC: Disable animation
            ribbon.style.animation = 'none';

            // MASSIVE RANGE: Ribbons can spawn anywhere from top to bottom
            // -50% to 150% ensures they fill the entire visible background
            var randomTop = Math.floor(Math.random() * 200) - 50;
            ribbon.style.top = randomTop + '%';

            // Add randomization to scale and vertical offset to create depth
            var scale = 0.9 + Math.random() * 0.6; // Slightly larger for coverage
            // Random Y offset to make them look less uniform
            var offsetY = Math.random() * 200 - 100;
            ribbon.style.transform = `rotate(-30deg) translateY(${offsetY}px) scale(${scale})`;

            // Randomize opacity slightly so they layer nicely without moving
            ribbon.style.opacity = 0.5 + Math.random() * 0.4;

            ribbonContainer.appendChild(ribbon);
        }
    }

    // --- Halloween Effects Creation ---
    function createHalloweenBackgroundBats() {
        var batCount = 20 + Math.floor(Math.random() * 10);
        for (var i = 0; i < batCount; i++) {
            var batWrapper = document.createElement('div');
            batWrapper.className = 'fcw-bat-bg';
            var paths = ['fcw-fly-swoop', 'fcw-fly-hunt', 'fcw-fly-dive', 'fcw-fly-circle', 'fcw-fly-cross', 'fcw-fly-loop'];
            var randomPath = paths[Math.floor(Math.random() * paths.length)];
            batWrapper.classList.add(randomPath);
            var batShape = document.createElement('div');
            batShape.className = 'fcw-bat-shape';
            batWrapper.appendChild(batShape);
            var size = 50 + Math.random() * 150;
            batWrapper.style.width = size + 'px';
            batWrapper.style.height = (size * 0.6) + 'px';
            var duration = 6 + Math.random() * 12;
            var delay = Math.random() * 12;
            batWrapper.style.setProperty('--flight-duration', duration + 's');
            batWrapper.style.animationDelay = `${delay}s`;
            batWrapper.style.zIndex = Math.random() > 0.6 ? 2 : -1;
            if (size < 25) {
                batWrapper.style.filter = 'blur(1.5px) opacity(0.7)';
            } else {
                batWrapper.style.filter = 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))';
            }
            batContainer.appendChild(batWrapper);
        }
    }

    function createSleekAmbientBats(targetContainer) {
        const batCount = 25;
        for (var i = 0; i < batCount; i++) {
            var batWrapper = document.createElement('div');
            batWrapper.className = 'fcw-sleek-bat';
            var paths = ['fcw-fly-swoop', 'fcw-fly-hunt', 'fcw-fly-circle', 'fcw-fly-cross', 'fcw-fly-panic'];
            var randomPath = paths[Math.floor(Math.random() * paths.length)];
            batWrapper.classList.add(randomPath);
            var jitterDiv = document.createElement('div');
            jitterDiv.style.width = '100%';
            jitterDiv.style.height = '100%';
            jitterDiv.style.animation = `fcw-bat-jitter ${0.3 + Math.random() * 0.4}s linear infinite`;
            batWrapper.appendChild(jitterDiv);
            var batShape = document.createElement('div');
            batShape.className = 'fcw-bat-shape';
            batShape.style.animationDuration = (0.1 + Math.random() * 0.05) + 's';
            jitterDiv.appendChild(batShape);
            var size = 100 + Math.random() * 250;
            batWrapper.style.width = size + 'px';
            batWrapper.style.height = (size * 0.6) + 'px';
            var duration = 3 + Math.random() * 5;
            var delay = Math.random() * 8;
            batWrapper.style.setProperty('--flight-duration', duration + 's');
            batWrapper.style.animationDelay = `${delay}s`;
            targetContainer.appendChild(batWrapper);
        }
    }

    // --- Futmas Snow Creation ---
    function createSnowEffects() {
        var snowCount = 50; // Balanced for style vs FPS
        for (var i = 0; i < snowCount; i++) {
            var flake = document.createElement('div');
            var isShaped = Math.random() > 0.7; // 30% are actual SVG shapes, rest are soft orbs

            flake.className = 'fcw-snowflake' + (isShaped ? ' shaped' : '');

            // Random horizontal position
            var leftPos = Math.random() * 100;
            flake.style.left = leftPos + '%';

            // Size variance
            var size = isShaped ? (10 + Math.random() * 15) : (3 + Math.random() * 5);
            flake.style.width = size + 'px';
            flake.style.height = size + 'px';

            // Sway physics (using CSS vars for GPU transform)
            var swayAmount = 20 + Math.random() * 50;
            var direction = Math.random() > 0.5 ? 1 : -1;
            flake.style.setProperty('--sway-start', '0px');
            flake.style.setProperty('--sway-end', (swayAmount * direction) + 'px');

            // Opacity
            flake.style.setProperty('--max-opacity', (0.4 + Math.random() * 0.5).toString());

            // Speed
            var duration = 5 + Math.random() * 10;
            flake.style.animationDuration = duration + 's';
            flake.style.animationDelay = (Math.random() * 5 * -1) + 's'; // Start randomly

            snowContainer.appendChild(flake);
        }
    }

    // --- Futmas Santa Creation ---
    function createSantaEffect() {
        var sleighWrapper = document.createElement('div');
        sleighWrapper.className = 'fcw-santa-sleigh-wrapper';

        var sleighSVG = document.createElement('div');
        sleighSVG.className = 'fcw-santa-sleigh-svg';

        sleighWrapper.appendChild(sleighSVG);
        santaContainer.appendChild(sleighWrapper);
    }


    // --- Vintage Film Effects Creation ---
    function createVintageEffects() {
        if (vintageEffectsActive) return;
        vintageEffectsActive = true;
        var grain = document.createElement('div'); grain.className = 'fcw-film-grain'; grain.id = 'fcw-vintage-grain'; document.body.appendChild(grain);
        var grainOverlay = document.createElement('div'); grainOverlay.className = 'fcw-film-grain-overlay'; grainOverlay.id = 'fcw-vintage-grain-overlay'; document.body.appendChild(grainOverlay);
        var vignette = document.createElement('div'); vignette.className = 'fcw-vignette-vintage'; vignette.id = 'fcw-vintage-vignette'; document.body.appendChild(vignette);
        var artifacts = document.createElement('div'); artifacts.className = 'fcw-film-artifacts'; artifacts.id = 'fcw-vintage-artifacts';
        for (var h = 0; h < 8; h++) { var hair = document.createElement('div'); hair.className = 'fcw-film-hair'; hair.style.left = Math.random() * 100 + '%'; hair.style.top = Math.random() * 100 + '%'; hair.style.width = (20 + Math.random() * 60) + 'px'; hair.style.height = (1 + Math.random() * 2) + 'px'; hair.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)'; hair.style.setProperty('--duration', (8 + Math.random() * 12) + 's'); hair.style.setProperty('--delay', (Math.random() * 10) + 's'); artifacts.appendChild(hair); }
        for (var d = 0; d < 12; d++) { var blob = document.createElement('div'); blob.className = 'fcw-dust-blob'; blob.style.left = Math.random() * 100 + '%'; blob.style.top = Math.random() * 100 + '%'; var blobSize = 5 + Math.random() * 20; blob.style.width = blobSize + 'px'; blob.style.height = blobSize * (0.6 + Math.random() * 0.8) + 'px'; blob.style.setProperty('--flicker-time', (3 + Math.random() * 5) + 's'); blob.style.setProperty('--delay', (Math.random() * 8) + 's'); artifacts.appendChild(blob); }
        for (var s = 0; s < 20; s++) { var speck = document.createElement('div'); speck.className = 'fcw-white-speck'; speck.style.left = Math.random() * 100 + '%'; speck.style.top = Math.random() * 100 + '%'; var speckSize = 1 + Math.random() * 3; speck.style.width = speckSize + 'px'; speck.style.height = speckSize + 'px'; speck.style.setProperty('--flash-time', (2 + Math.random() * 4) + 's'); speck.style.setProperty('--delay', (Math.random() * 6) + 's'); artifacts.appendChild(speck); }
        for (var sc = 0; sc < 4; sc++) { var scratch = document.createElement('div'); scratch.className = 'fcw-emulsion-scratch'; scratch.style.left = (10 + Math.random() * 80) + '%'; scratch.style.setProperty('--scratch-time', (5 + Math.random() * 8) + 's'); scratch.style.setProperty('--delay', (Math.random() * 10) + 's'); artifacts.appendChild(scratch); }
        for (var w = 0; w < 3; w++) { var stain = document.createElement('div'); stain.className = 'fcw-water-stain'; stain.style.left = Math.random() * 80 + '%'; stain.style.top = Math.random() * 80 + '%'; var stainSize = 50 + Math.random() * 150; stain.style.width = stainSize + 'px'; stain.style.height = stainSize * (0.5 + Math.random() * 0.5) + 'px'; stain.style.setProperty('--stain-time', (15 + Math.random() * 15) + 's'); stain.style.setProperty('--delay', (Math.random() * 20) + 's'); artifacts.appendChild(stain); }
        document.body.appendChild(artifacts);
        var burn = document.createElement('div'); burn.className = 'fcw-cigarette-burn'; burn.id = 'fcw-vintage-burn'; document.body.appendChild(burn);
        var leakPositions = [{ top: '0', left: '0', width: '30%', height: '40%', color: 'rgba(255, 200, 100, 0.3)' }, { bottom: '0', right: '0', width: '25%', height: '35%', color: 'rgba(255, 180, 80, 0.25)' }, { top: '20%', right: '0', width: '15%', height: '60%', color: 'rgba(255, 220, 150, 0.2)' }];
        leakPositions.forEach(function (pos, i) { var leak = document.createElement('div'); leak.className = 'fcw-light-leak'; leak.id = 'fcw-vintage-leak-' + i; if (pos.top) leak.style.top = pos.top; if (pos.bottom) leak.style.bottom = pos.bottom; if (pos.left) leak.style.left = pos.left; if (pos.right) leak.style.right = pos.right; leak.style.width = pos.width; leak.style.height = pos.height; leak.style.background = 'radial-gradient(ellipse at center, ' + pos.color + ' 0%, transparent 70%)'; leak.style.setProperty('--pulse-time', (8 + i * 3) + 's'); leak.style.setProperty('--delay', (i * 2) + 's'); leak.style.setProperty('--max-opacity', (0.4 + Math.random() * 0.3).toString()); document.body.appendChild(leak); });
        var lineLeft = document.createElement('div'); lineLeft.className = 'fcw-frame-line'; lineLeft.id = 'fcw-vintage-line-left'; lineLeft.style.left = '3%'; document.body.appendChild(lineLeft);
        var lineRight = document.createElement('div'); lineRight.className = 'fcw-frame-line'; lineRight.id = 'fcw-vintage-line-right'; lineRight.style.right = '3%'; document.body.appendChild(lineRight);
        var sprocketLeft = document.createElement('div'); sprocketLeft.className = 'fcw-sprocket-edge left'; sprocketLeft.id = 'fcw-vintage-sprocket-left'; document.body.appendChild(sprocketLeft);
        var sprocketRight = document.createElement('div'); sprocketRight.className = 'fcw-sprocket-edge right'; sprocketRight.id = 'fcw-vintage-sprocket-right'; document.body.appendChild(sprocketRight);
        var shutter = document.createElement('div'); shutter.className = 'fcw-shutter-blackout'; shutter.id = 'fcw-vintage-shutter'; document.body.appendChild(shutter);
        var hotspot = document.createElement('div'); hotspot.className = 'fcw-projector-hotspot'; hotspot.id = 'fcw-vintage-hotspot'; document.body.appendChild(hotspot);
    }

    function removeVintageEffects() {
        if (!vintageEffectsActive) return;
        vintageEffectsActive = false;
        var elementsToRemove = ['fcw-vintage-grain', 'fcw-vintage-grain-overlay', 'fcw-vintage-vignette', 'fcw-vintage-artifacts', 'fcw-vintage-burn', 'fcw-vintage-leak-0', 'fcw-vintage-leak-1', 'fcw-vintage-leak-2', 'fcw-vintage-line-left', 'fcw-vintage-line-right', 'fcw-vintage-sprocket-left', 'fcw-vintage-sprocket-right', 'fcw-vintage-shutter', 'fcw-vintage-hotspot'];
        elementsToRemove.forEach(function (id) { var el = document.getElementById(id); if (el) el.remove(); });
    }

    // --- OPTIMIZED MOUSE TRACKING (FPS FIX) ---
    let rafId = null;

    document.addEventListener('mousemove', function (e) {
        if (!modal.classList.contains('active')) return;

        // Use requestAnimationFrame to debounce high-frequency mouse events
        if (rafId) return;

        rafId = requestAnimationFrame(() => {
            var rect = stage.getBoundingClientRect();
            var centerX = rect.left + rect.width / 2;
            var centerY = rect.top + rect.height / 2;
            var x = e.clientX - centerX;
            var y = e.clientY - centerY;

            if (!isPaused) {
                var maxRotation = 12;
                var rotateX = (y / (rect.height / 2)) * -maxRotation;
                var rotateY = (x / (rect.width / 2)) * maxRotation;
                container.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';

                var sparkleField = wrapper.querySelector('.fcw-scintillation-field');
                if (sparkleField) {
                    var danceFactorX = (x / rect.width) * -20;
                    var danceFactorY = (y / rect.height) * -20;
                    sparkleField.style.transform = `translateZ(85px) translateX(${danceFactorX}px) translateY(${danceFactorY}px)`;
                }
            }

            var card = wrapper.querySelector('.fcw-cloned-card');
            if (card) {
                var beamX = ((e.clientX - rect.left) / rect.width) * 100;
                var beamY = ((e.clientY - rect.top) / rect.height) * 100;
                var angle = Math.atan2(y, x) * (180 / Math.PI) + 180;
                card.style.setProperty('--beam-x', beamX + '%');
                card.style.setProperty('--beam-y', beamY + '%');
                card.style.setProperty('--streak-angle', (angle + 90) + 'deg');
            }

            rafId = null;
        });
    });

    // --- 5. Card Detection ---
    function findCardContainer(target) {
        var curr = target;
        for (var i = 0; i < 15; i++) {
            if (!curr || curr === document.body) return null;
            var classList = curr.className || '';
            if (typeof classList === 'string' && (
                classList.includes('playercard') || classList.includes('player-card') ||
                classList.includes('fut-card') || classList.includes('card-container') ||
                classList.includes('ut-card') || classList.includes('card-item')
            )) {
                return curr;
            }
            var rect = curr.getBoundingClientRect();
            var aspectRatio = rect.height / rect.width;
            if (aspectRatio > 1.3 && aspectRatio < 1.8 && rect.width > 80 && rect.width < 400) {
                var hasPlayerImage = curr.querySelector('img');
                if (hasPlayerImage) return curr;
            }
            curr = curr.parentElement;
        }
        return null;
    }

    // --- 6. Image Helpers ---
    function upgradeImageUrl(src) {
        if (!src) return src;
        return src.replace(/_small./gi, '.').replace(/\/small\//gi, '/large/');
    }

    function isDynamicImage(img) {
        if (!img || !img.src) return false;
        var src = img.src.toLowerCase();
        var headshotPatterns = ['headshot', 'head_', 'portrait', '/faces/', 'face_', '_face', 'small', 'mini'];
        for (var i = 0; i < headshotPatterns.length; i++) {
            if (src.indexOf(headshotPatterns[i]) !== -1) return false;
        }
        return true;
    }

    function isCardDesignImage(img) {
        if (!img || !img.src) return false;
        var src = img.src.toLowerCase();
        var cardPatterns = ['card', 'background', 'bg_', '_bg', 'design', 'template', 'frame', 'border', 'base', 'item', 'rare', 'common', 'toty', 'tots', 'totw', 'fut', 'promo', 'event'];
        for (var i = 0; i < cardPatterns.length; i++) {
            if (src.indexOf(cardPatterns[i]) !== -1) return true;
        }
        return false;
    }

    // --- 7. Create Particles ---
    function createParticles(container, count, isAmbient, isDreamTeamMode, isFWIconMode, isHalloweenMode, isIcon26Mode, isFutmasMode) {
        var particlesDiv = isAmbient ? container : document.createElement('div');
        if (!isAmbient) particlesDiv.className = 'fcw-effect-particles';

        // HALLOWEEN (Orange/Green/Purple)
        if (isAmbient && isHalloweenMode) {
            for (var i = 0; i < 40; i++) {
                var ember = document.createElement('div');
                var rand = Math.random();
                var colorClass = 'h-orange';
                if (rand > 0.6) colorClass = 'h-purple';
                if (rand > 0.85) colorClass = 'h-green';
                ember.className = 'fcw-particle-ember ' + colorClass;
                ember.style.left = Math.random() * 100 + '%';
                var duration = 4 + Math.random() * 6;
                var delay = Math.random() * 8;
                ember.style.setProperty('--rise-duration', duration + 's');
                ember.style.setProperty('--rise-delay', delay + 's');
                ember.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
                ember.style.setProperty('--max-opacity', (0.5 + Math.random() * 0.4).toString());
                particlesDiv.appendChild(ember);
            }
            return;
        }

        // FW ICON (RED & GOLD)
        if (isAmbient && isFWIconMode) {
            for (var i = 0; i < 40; i++) {
                var ember = document.createElement('div');
                ember.className = 'fcw-particle-ember ' + (i % 2 === 0 ? 'fw-red' : 'fw-gold');
                ember.style.left = Math.random() * 100 + '%';
                var duration = 4 + Math.random() * 4;
                var delay = Math.random() * 8;
                ember.style.setProperty('--rise-duration', duration + 's');
                ember.style.setProperty('--rise-delay', delay + 's');
                ember.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
                ember.style.setProperty('--max-opacity', (0.5 + Math.random() * 0.4).toString());
                particlesDiv.appendChild(ember);
            }
            return;
        }

        // FUTMAS (RED, GREEN & GOLD)
        if (isAmbient && isFutmasMode) {
            for (var i = 0; i < 45; i++) {
                var ember = document.createElement('div');
                var rand = Math.random();
                var colorClass = 'fw-gold';
                if (rand > 0.33) colorClass = 'fcw-sparkle-red';
                if (rand > 0.66) colorClass = 'fcw-sparkle-green';
                ember.className = 'fcw-particle-ember ' + colorClass;
                ember.style.left = Math.random() * 100 + '%';
                var duration = 4 + Math.random() * 5;
                var delay = Math.random() * 8;
                ember.style.setProperty('--rise-duration', duration + 's');
                ember.style.setProperty('--rise-delay', delay + 's');
                ember.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
                ember.style.setProperty('--max-opacity', (0.6 + Math.random() * 0.4).toString());
                particlesDiv.appendChild(ember);
            }
            return;
        }

        // FC 26 ICON (LUXURY GOLD) - OPTIMIZED PARTICLE COUNT
        if (isAmbient && isIcon26Mode) {
            // FPS FIX: Reduced from 20 to 10 to improve performance
            for (var i = 0; i < 10; i++) {
                var ember = document.createElement('div');
                // Mix of Deep Gold, Champagne, and White
                var rand = Math.random();
                var type = 'i26-gold';
                if (rand > 0.5) type = 'i26-champagne';
                if (rand > 0.8) type = 'i26-white';
                ember.className = 'fcw-particle-ember ' + type;
                ember.style.left = Math.random() * 100 + '%';
                var duration = 5 + Math.random() * 4;
                var delay = Math.random() * 8;
                ember.style.setProperty('--rise-duration', duration + 's');
                ember.style.setProperty('--rise-delay', delay + 's');
                ember.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
                ember.style.setProperty('--max-opacity', (0.6 + Math.random() * 0.4).toString());
                particlesDiv.appendChild(ember);
            }
            return;
        }

        if (isAmbient && isDreamTeamMode) {
            for (var i = 0; i < 25; i++) {
                var ember = document.createElement('div');
                ember.className = 'fcw-particle-ember';
                ember.style.left = Math.random() * 100 + '%';
                var duration = 5 + Math.random() * 5;
                var delay = Math.random() * 8;
                ember.style.setProperty('--rise-duration', duration + 's');
                ember.style.setProperty('--rise-delay', delay + 's');
                ember.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
                ember.style.setProperty('--max-opacity', (0.2 + Math.random() * 0.3).toString());
                particlesDiv.appendChild(ember);
            }
            return;
        }

        for (var k = 0; k < count; k++) {
            var particle = document.createElement('div');
            particle.className = 'fcw-particle';
            particle.style.left = (Math.random() * 100) + '%';
            particle.style.bottom = (Math.random() * (isAmbient ? 100 : 30)) + '%';
            var sizeBase = isAmbient ? 1.5 : 1;
            particle.style.setProperty('--size', (sizeBase + Math.random() * 2) + 'px');
            particle.style.setProperty('--opacity', (0.2 + Math.random() * 0.3).toString());
            particle.style.setProperty('--delay', (Math.random() * 5) + 's');
            particle.style.setProperty('--duration', ((isAmbient ? 10 : 4) + Math.random() * 5) + 's');
            if (isAmbient) {
                particle.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)';
            }
            particlesDiv.appendChild(particle);
        }
        if (!isAmbient) container.appendChild(particlesDiv);
    }

    // --- 7.5 Create Scintillation Effect (Sparkles) ---
    function createScintillation(clone) {
        var field = document.createElement('div');
        field.className = 'fcw-scintillation-field';

        for (var i = 0; i < 28; i++) {
            var star = document.createElement('div');
            var top = Math.random() * 100;
            var left = Math.random() * 100;
            star.className = 'fcw-scintilla-star';
            star.style.top = top + '%';
            star.style.left = left + '%';

            var size = 8 + Math.random() * 14;
            star.style.setProperty('--dims', size + 'px');

            var duration = 1.2 + Math.random() * 1.5;
            var delay = Math.random() * 5;
            star.style.setProperty('--duration', duration + 's');
            star.style.setProperty('--delay', delay + 's');

            star.style.setProperty('--intensity', (0.7 + Math.random() * 0.3).toString());

            var rotation = Math.floor(Math.random() * 90);
            star.style.setProperty('--rot', rotation + 'deg');

            field.appendChild(star);
        }

        clone.appendChild(field);
    }

    // --- 8. Process Clone Layers ---
    function processCloneLayers(clone) {
        var imgs = clone.querySelectorAll('img');
        var cardTypeInfo = { isSpecial: false, isDreamTeam: false, isSilverDreamTeam: false, isBronzeDreamTeam: false, isVintage: false, isFWIcon: false, isHalloween: false, isIcon26: false, isFutmas: false, customThemeEffect: null };

        var isDreamTeamPlayer = false;
        var isSilverDreamTeamPlayer = false;
        var isBronzeDreamTeamPlayer = false;
        var isVintagePlayer = false;
        var isFWIconPlayer = false;
        var isHalloweenPlayer = false;
        var isIcon26Player = false;
        var isFutmasPlayer = false;
        var customThemeMatch = null;

        var dreamTeamCardImage = "https://cdn.fc-watch.com/img/26/cards/bddt_gold.png";
        var dreamTeamSilverCardImage = "https://cdn.fc-watch.com/img/26/cards/bddt_silver.png";
        var dreamTeamBronzeCardImage = "https://cdn.fc-watch.com/img/26/cards/bddt_bronze.png";
        var vintageCardImage = "https://cdn.fc-watch.com/img/26/cards/hh.png";
        var fwIconCardImage = "https://cdn.fc-watch.com/img/26/cards/fw_icon.png";
        var halloweenCardImage = "https://cdn.fc-watch.com/img/26/cards/halloween.png";
        var icon26CardImage = "https://cdn.fc-watch.com/img/26/cards/12_icon.png";
        var futmasCardImage = "https://cdn.fc-watch.com/img/26/cards/futmas.png";

        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            var originalSrc = img.src || img.getAttribute('src');
            if (originalSrc) {
                img.src = upgradeImageUrl(originalSrc);
                if (img.src === dreamTeamCardImage || originalSrc === dreamTeamCardImage) {
                    isDreamTeamPlayer = true;
                }
                if (img.src === dreamTeamSilverCardImage || originalSrc === dreamTeamSilverCardImage) {
                    isSilverDreamTeamPlayer = true;
                }
                if (img.src === dreamTeamBronzeCardImage || originalSrc === dreamTeamBronzeCardImage) {
                    isBronzeDreamTeamPlayer = true;
                }
                if (img.src === vintageCardImage || originalSrc === vintageCardImage) {
                    isVintagePlayer = true;
                }
                if (img.src === fwIconCardImage || originalSrc === fwIconCardImage) {
                    isFWIconPlayer = true;
                }
                if (img.src === halloweenCardImage || originalSrc === halloweenCardImage) {
                    isHalloweenPlayer = true;
                }
                if (img.src === icon26CardImage || originalSrc === icon26CardImage) {
                    isIcon26Player = true;
                }
                // NEW FUTMAS CHECK
                if (img.src === futmasCardImage || originalSrc === futmasCardImage) {
                    isFutmasPlayer = true;
                }

                // CHECK CUSTOM THEMES - match patterns against image URL
                if (!customThemeMatch && customThemes.length > 0) {
                    for (var ct = 0; ct < customThemes.length; ct++) {
                        var theme = customThemes[ct];
                        if (theme.enabled && theme.pattern) {
                            // Check if pattern matches (supports partial URL or filename match)
                            if (originalSrc.toLowerCase().includes(theme.pattern.toLowerCase()) ||
                                img.src.toLowerCase().includes(theme.pattern.toLowerCase())) {
                                customThemeMatch = theme;
                                console.log('%c🎨 Custom theme matched:', 'color: #FFD700;', theme.name);
                                break;
                            }
                        }
                    }
                }
            }
            img.removeAttribute('loading');
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            img.style.display = 'block';
        }

        cardTypeInfo.isDreamTeam = isDreamTeamPlayer;
        cardTypeInfo.isSilverDreamTeam = isSilverDreamTeamPlayer;
        cardTypeInfo.isBronzeDreamTeam = isBronzeDreamTeamPlayer;
        cardTypeInfo.isVintage = isVintagePlayer;
        cardTypeInfo.isFWIcon = isFWIconPlayer;
        cardTypeInfo.isHalloween = isHalloweenPlayer;
        cardTypeInfo.isIcon26 = isIcon26Player;
        cardTypeInfo.isFutmas = isFutmasPlayer;

        // Custom theme takes priority if matched
        if (customThemeMatch) {
            cardTypeInfo.customThemeEffect = customThemeMatch.effectType;
        }

        var playerImg = null;
        var maxArea = 0;

        for (var j = 0; j < imgs.length; j++) {
            var curr = imgs[j];

            // --- LAYER LOGIC ---

            // 1. Is it the Card Background?
            if (isCardDesignImage(curr)) {
                curr.classList.add('fcw-layer-base');
                // If Vintage, apply the sepia filter to the BACKGROUND
                if (isVintagePlayer) {
                    curr.classList.add('fcw-vintage-filter-layer');
                }
                continue;
            }

            var rect = curr.getBoundingClientRect();

            // 2. Is it a small icon (Flag, Badge, Rating)?
            if (rect.width < 60 || rect.height < 60) {
                curr.classList.add((isDreamTeamPlayer || isSilverDreamTeamPlayer || isBronzeDreamTeamPlayer || isVintagePlayer || isFWIconPlayer || isHalloweenPlayer || isIcon26Player || isFutmasPlayer) ? 'fcw-layer-icon-pop' : 'fcw-layer-flat');
                continue;
            }

            // 3. Find the biggest image (Player Face)
            var area = rect.width * rect.height;
            if (area > maxArea) {
                maxArea = area;
                playerImg = curr;
            }
        }

        if (playerImg) {
            playerImg.classList.remove('fcw-layer-icon-pop', 'fcw-layer-flat');

            // If Vintage, apply the sepia filter to the PLAYER FACE
            if (isVintagePlayer) {
                playerImg.classList.add('fcw-vintage-filter-layer');
            }

            if ((isDreamTeamPlayer || isSilverDreamTeamPlayer || isBronzeDreamTeamPlayer || isVintagePlayer || isFWIconPlayer || isHalloweenPlayer || isIcon26Player || isFutmasPlayer) && isDynamicImage(playerImg)) {
                playerImg.classList.add('fcw-layer-player-dynamic');
                cardTypeInfo.isSpecial = true;
            } else {
                playerImg.classList.add('fcw-layer-flat');
            }
        }

        return cardTypeInfo;
    }

    // --- 9. Add Premium Effects (Shadows, Radiance, Sparkles) ---
    function addPremiumEffects(clone, isHalloweenMode, isIcon26Mode) {
        var shadow = document.createElement('div');
        shadow.className = 'fcw-effect-ultra-shadow';
        clone.appendChild(shadow);

        var radiance = document.createElement('div');
        radiance.className = 'fcw-effect-radiance';
        clone.appendChild(radiance);

        // Add standard floating particles to the card container itself
        createParticles(clone, 10, false, false, false, false, false, false);

        // ONLY add sparkles if it is NOT a Halloween card AND NOT an Icon 26 card (FPS Fix)
        if (!isHalloweenMode && !isIcon26Mode) {
            createScintillation(clone);
        }
    }

    // --- 10. Add Standard Effects ---
    function addStandardEffects(clone) {
        var shadow = document.createElement('div');
        shadow.className = 'fcw-effect-standard-shadow';
        clone.appendChild(shadow);
    }

    // --- 11. Add Vintage Card Effects ---
    function addVintageCardEffects(clone) {
        var shadow = document.createElement('div');
        shadow.className = 'fcw-effect-standard-shadow';
        shadow.style.background = 'rgba(30, 25, 15, 0.7)';
        shadow.style.filter = 'blur(40px)';
        clone.appendChild(shadow);
    }

    // --- 12. Open Inspector ---
    function openInspector(originalCard) {
        isPaused = false;
        currentCard = originalCard;

        var rect = originalCard.getBoundingClientRect();
        var targetHeight = window.innerHeight * 0.78;
        var scale = targetHeight / rect.height;

        stage.style.width = (rect.width * scale) + 'px';
        stage.style.height = (rect.height * scale) + 'px';

        var clone = originalCard.cloneNode(true);
        clone.classList.add('fcw-cloned-card');

        var cardInfo = processCloneLayers(clone);

        if ('zoom' in clone.style) {
            clone.style.zoom = scale;
            clone.style.width = rect.width + 'px';
            clone.style.height = rect.height + 'px';
        } else {
            clone.style.transform = 'scale(' + scale + ')';
            clone.style.transformOrigin = 'center center';
        }

        modal.classList.remove('dream-active', 'silver-active', 'bronze-active', 'vintage-active', 'fw-icon-active', 'halloween-active', 'icon-26-active', 'futmas-active');
        removeVintageEffects();
        ribbonContainer.innerHTML = ''; // Clear ribbons
        batContainer.innerHTML = ''; // Clear background bats
        foregroundBatContainer.innerHTML = ''; // Clear foreground bats
        snowContainer.innerHTML = ''; // Clear snow
        santaContainer.innerHTML = ''; // Clear santa

        // --- CUSTOM THEME HANDLING (HIGHEST PRIORITY) ---
        if (cardInfo.customThemeEffect) {
            var effect = cardInfo.customThemeEffect;
            console.log('%c🎨 Applying custom theme effect:', 'color: #FFD700;', effect);

            // Apply effects based on the custom theme's effect type
            switch (effect) {
                case 'dream':
                    addPremiumEffects(clone, false, false);
                    modal.classList.add('dream-active');
                    createParticles(ambientParticles, 30, true, true, false, false, false, false);
                    break;
                case 'silver':
                    addPremiumEffects(clone, false, false);
                    modal.classList.add('silver-active');
                    createParticles(ambientParticles, 30, true, true, false, false, false, false);
                    break;
                case 'bronze':
                    addPremiumEffects(clone, false, false);
                    modal.classList.add('bronze-active');
                    createParticles(ambientParticles, 30, true, true, false, false, false, false);
                    break;
                case 'fw-icon':
                    addPremiumEffects(clone, false, false);
                    modal.classList.add('fw-icon-active');
                    createRibbonEffects();
                    createParticles(ambientParticles, 30, true, false, true, false, false, false);
                    break;
                case 'icon-26':
                    addPremiumEffects(clone, false, true);
                    modal.classList.add('icon-26-active');
                    createIcon26Ribbons();
                    createParticles(ambientParticles, 45, true, false, false, false, true, false);
                    break;
                case 'halloween':
                    addPremiumEffects(clone, true, false);
                    modal.classList.add('halloween-active');
                    createHalloweenBackgroundBats();
                    createSleekAmbientBats(foregroundBatContainer);
                    createParticles(ambientParticles, 40, true, false, false, true, false, false);
                    break;
                case 'futmas':
                    addPremiumEffects(clone, false, false);
                    modal.classList.add('futmas-active');
                    createSnowEffects();
                    createSantaEffect();
                    createParticles(ambientParticles, 45, true, false, false, false, false, true);
                    break;
                case 'vintage':
                    addVintageCardEffects(clone);
                    modal.classList.add('vintage-active');
                    createVintageEffects();
                    createParticles(ambientParticles, 3, true, false, false, false, false, false);
                    break;
                default:
                    addStandardEffects(clone);
                    createParticles(ambientParticles, 20, true, false, false, false, false, false);
            }
        } else if (cardInfo.isVintage) {
            addVintageCardEffects(clone);
            modal.classList.add('vintage-active');
            createVintageEffects();
            createParticles(ambientParticles, 3, true, false, false, false, false, false);
        } else if (cardInfo.isFWIcon) {
            addPremiumEffects(clone, false, false);
            modal.classList.add('fw-icon-active');
            createRibbonEffects();
            createParticles(ambientParticles, 30, true, false, true, false, false, false);
        } else if (cardInfo.isHalloween) {
            addPremiumEffects(clone, true, false);
            modal.classList.add('halloween-active');
            createHalloweenBackgroundBats();
            createSleekAmbientBats(foregroundBatContainer);
            createParticles(ambientParticles, 40, true, false, false, true, false, false);
        } else if (cardInfo.isIcon26) {
            addPremiumEffects(clone, false, true);
            modal.classList.add('icon-26-active');
            createIcon26Ribbons();
            createParticles(ambientParticles, 45, true, false, false, false, true, false);
        } else if (cardInfo.isFutmas) {
            // --- NEW FUTMAS LOGIC ---
            addPremiumEffects(clone, false, false);
            modal.classList.add('futmas-active');
            createSnowEffects();
            createSantaEffect(); // Trigger modern Santa sleigh animation
            createParticles(ambientParticles, 45, true, false, false, false, false, true);
        } else if (cardInfo.isDreamTeam) {
            addPremiumEffects(clone, false, false);
            modal.classList.add('dream-active');
            createParticles(ambientParticles, 30, true, true, false, false, false, false);
        } else if (cardInfo.isSilverDreamTeam) {
            addPremiumEffects(clone, false, false);
            modal.classList.add('silver-active');
            createParticles(ambientParticles, 30, true, true, false, false, false, false);
        } else if (cardInfo.isBronzeDreamTeam) {
            addPremiumEffects(clone, false, false);
            modal.classList.add('bronze-active');
            createParticles(ambientParticles, 30, true, true, false, false, false, false);
        } else {
            addStandardEffects(clone);
            createParticles(ambientParticles, 20, true, false, false, false, false, false);
        }

        clone.style.visibility = 'visible';
        clone.style.opacity = '1';

        wrapper.innerHTML = '';
        wrapper.appendChild(clone);

        modal.classList.add('active');
    }

    // --- 13. Event Handlers ---
    document.addEventListener('dblclick', function (e) {
        var card = findCardContainer(e.target);
        if (card) {
            e.preventDefault();
            e.stopPropagation();
            e.stopPropagation();
            e.stopPropagation();
            openInspector(card);
        }
    });

    var lastTap = 0;
    document.addEventListener('touchend', function (e) {
        var currentTime = new Date().getTime();
        var tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            var card = findCardContainer(e.target);
            if (card) {
                e.preventDefault();
                e.stopPropagation();
                e.stopPropagation();
                openInspector(card);
            }
        }
        lastTap = currentTime;
    });

    console.log('%c🎬 FC Watch Inspector v18.0', 'color: #FFD700; font-size: 14px; font-weight: bold;');
    console.log('%c✨ Theme Manager Enabled', 'color: #00FF00; font-size: 12px;');

})();