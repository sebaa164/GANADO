<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Iniciar sesión — GanadoVision</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            overflow: hidden;
            position: relative;
        }

        /* ── Fondo foto Ken Burns ── */
        .bg-photo {
            position: fixed;
            inset: 0;
            z-index: 0;
        }
        .bg-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            animation: kenburns 22s ease-in-out infinite;
            will-change: transform;
        }
        .bg-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(
                135deg,
                rgba(5,18,5,0.90)  0%,
                rgba(15,45,15,0.82) 40%,
                rgba(35,80,35,0.65) 70%,
                rgba(45,106,45,0.40) 100%
            );
        }
        @keyframes kenburns {
            0%   { transform: scale(1.00) translate( 0%,    0%);  }
            25%  { transform: scale(1.07) translate(-1.5%, -1%);  }
            50%  { transform: scale(1.12) translate( 1%,   -2%);  }
            75%  { transform: scale(1.07) translate(-0.5%,  0.5%);}
            100% { transform: scale(1.00) translate( 0%,    0%);  }
        }

        /* ── Contenedor principal ── */
        .page {
            position: relative;
            z-index: 1;
            min-height: 100vh;
            display: flex;
            align-items: stretch;
        }

        /* ── Panel izquierdo (solo desktop) ── */
        .panel-left {
            display: none;
            flex: 1;
            flex-direction: column;
            justify-content: space-between;
            padding: 56px 56px 48px;
        }
        @media (min-width: 1024px) {
            .panel-left { display: flex; }
        }

        .brand-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideUp .5s ease both;
        }
        .brand-icon {
            width: 44px; height: 44px;
            border-radius: 14px;
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.20);
            display: flex; align-items: center; justify-content: center;
            backdrop-filter: blur(12px);
        }
        .brand-icon svg { width: 22px; height: 22px; stroke: white; }
        .brand-name { color: white; font-weight: 700; font-size: 20px; letter-spacing: -0.3px; }
        .brand-sub  { color: rgba(255,255,255,0.40); font-size: 11px; margin-top: 2px; }

        .left-body { animation: slideUp .5s ease .15s both; }

        .badge-live {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,0.10);
            border: 1px solid rgba(255,255,255,0.18);
            backdrop-filter: blur(14px);
            border-radius: 999px;
            padding: 6px 14px;
            font-size: 12px;
            color: rgba(255,255,255,0.80);
            margin-bottom: 20px;
        }
        .dot-live {
            position: relative;
            width: 8px; height: 8px;
        }
        .dot-live span {
            display: block;
            width: 8px; height: 8px;
            border-radius: 50%;
            background: #4ade80;
        }
        .dot-live span.ping {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: #4ade80;
            opacity: 0.75;
            animation: ping 1.8s ease infinite;
        }
        @keyframes ping {
            75%,100% { transform: scale(2.2); opacity: 0; }
        }

        .left-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(40px, 4.5vw, 60px);
            font-weight: 800;
            color: white;
            line-height: 1.08;
            margin-bottom: 20px;
            text-shadow: 0 4px 24px rgba(0,0,0,0.55);
        }
        .left-title em {
            font-style: italic;
            color: #C0DD97;
        }
        .left-desc {
            color: rgba(255,255,255,0.60);
            font-size: 15px;
            line-height: 1.7;
            max-width: 400px;
            margin-bottom: 36px;
        }

        .stats-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            max-width: 340px;
        }
        .stat-card {
            background: rgba(255,255,255,0.09);
            border: 1px solid rgba(255,255,255,0.16);
            backdrop-filter: blur(14px);
            border-radius: 16px;
            padding: 16px 12px;
            text-align: center;
        }
        .stat-num  { font-size: 26px; font-weight: 700; color: white; }
        .stat-num.accent { color: #C0DD97; }
        .stat-lbl  { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 4px; }

        .left-footer {
            font-size: 11px;
            color: rgba(255,255,255,0.22);
            animation: slideUp .5s ease .45s both;
        }

        /* ── Panel derecho: card formulario ── */
        .panel-right {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        @media (min-width: 1024px) {
            .panel-right {
                width: auto;
                min-width: 460px;
                padding: 48px;
            }
        }

        .form-card {
            width: 100%;
            max-width: 400px;
            background: rgba(255,255,255,0.96);
            border-radius: 28px;
            padding: 40px 36px;
            box-shadow: 0 32px 80px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.08);
            animation: slideUp .55s ease both;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(22px); }
            to   { opacity: 1; transform: translateY(0);    }
        }

        /* Mobile logo dentro de la card */
        .mobile-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 28px;
        }
        @media (min-width: 1024px) { .mobile-brand { display: none; } }

        .mobile-brand-icon {
            width: 36px; height: 36px;
            border-radius: 10px;
            background: #2D6A2D;
            display: flex; align-items: center; justify-content: center;
        }
        .mobile-brand-icon svg { width: 18px; height: 18px; stroke: white; }
        .mobile-brand-name { font-weight: 700; font-size: 17px; color: #111; letter-spacing: -0.3px; }

        /* Encabezado del form */
        .form-tag {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #2D6A2D;
            margin-bottom: 6px;
        }
        .form-title {
            font-family: 'Playfair Display', serif;
            font-size: 30px;
            font-weight: 700;
            color: #111;
            line-height: 1.15;
            margin-bottom: 6px;
        }
        .form-sub {
            font-size: 13px;
            color: #9ca3af;
            margin-bottom: 28px;
        }

        /* Error */
        .alert-error {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            background: #fff1f0;
            border: 1px solid #fecaca;
            border-radius: 14px;
            padding: 14px;
            margin-bottom: 20px;
        }
        .alert-icon {
            width: 30px; height: 30px;
            border-radius: 50%;
            background: #C94A3F;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .alert-icon svg { width: 14px; height: 14px; fill: white; }
        .alert-title { font-size: 13px; font-weight: 600; color: #C94A3F; }
        .alert-msg   { font-size: 12px; color: #9ca3af; margin-top: 2px; }

        /* Campos */
        .field-group { margin-bottom: 16px; }
        .field-label {
            display: block;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #6b7280;
            margin-bottom: 6px;
        }
        .field-wrap { position: relative; }
        .field-icon {
            position: absolute;
            top: 50%; left: 13px;
            transform: translateY(-50%);
            pointer-events: none;
            color: #9ca3af;
        }
        .field-icon svg { width: 16px; height: 16px; stroke: currentColor; }
        .field-input {
            width: 100%;
            padding: 12px 14px 12px 40px;
            border: 1.5px solid #e5e7eb;
            border-radius: 12px;
            background: #f9fafb;
            font-size: 14px;
            color: #111;
            font-family: 'Inter', sans-serif;
            transition: border-color .2s, box-shadow .2s;
        }
        .field-input::placeholder { color: #d1d5db; }
        .field-input:hover  { border-color: #d1d5db; }
        .field-input:focus  {
            outline: none;
            border-color: #2D6A2D;
            box-shadow: 0 0 0 3px rgba(45,106,45,0.12);
            background: white;
        }
        .field-toggle {
            position: absolute;
            top: 50%; right: 12px;
            transform: translateY(-50%);
            background: none; border: none;
            cursor: pointer; padding: 4px;
            color: #9ca3af;
            display: flex; align-items: center;
        }
        .field-toggle:hover { color: #6b7280; }
        .field-toggle svg { width: 16px; height: 16px; stroke: currentColor; }

        /* Recordar */
        .remember-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 20px;
        }
        .remember-row input[type=checkbox] {
            width: 16px; height: 16px;
            border-radius: 4px;
            accent-color: #2D6A2D;
            cursor: pointer;
        }
        .remember-row label { font-size: 13px; color: #6b7280; cursor: pointer; }

        /* Botón submit */
        .btn-submit {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 14px;
            color: white;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.02em;
            font-family: 'Inter', sans-serif;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: linear-gradient(270deg, #1a3d1a, #2D6A2D, #3B6D11, #639922, #2D6A2D);
            background-size: 300% 300%;
            animation: gradShift 7s ease infinite;
            transition: transform .15s, box-shadow .15s;
        }
        .btn-submit:hover  { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(45,106,45,0.45); }
        .btn-submit:active { transform: none; box-shadow: none; }
        .btn-submit svg    { width: 16px; height: 16px; stroke: white; }
        @keyframes gradShift {
            0%,100% { background-position: 0%   50%; }
            50%     { background-position: 100% 50%; }
        }

        /* Footer de la card */
        .card-footer {
            margin-top: 28px;
            padding-top: 20px;
            border-top: 1px solid #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-size: 12px;
            color: #9ca3af;
        }
        .dot-online {
            position: relative;
            width: 8px; height: 8px; flex-shrink: 0;
        }
        .dot-online span {
            display: block;
            width: 8px; height: 8px;
            border-radius: 50%;
            background: #4ade80;
        }
        .dot-online span.ping {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: #4ade80;
            opacity: .7;
            animation: ping 1.8s ease infinite;
        }
        .card-sep { color: #e5e7eb; }
    </style>
</head>
<body x-data="{ showPass: false }">

    {{-- Fondo foto Ken Burns --}}
    <div class="bg-photo">
        <img src="{{ asset('images/login-bg.jpg') }}" alt="Ganado en paisaje verde">
        <div class="bg-overlay"></div>
    </div>

    <div class="page">

        {{-- Panel izquierdo — solo desktop --}}
        <div class="panel-left">

            <div class="brand-logo">
                <div class="brand-icon">
                    <svg fill="none" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                </div>
                <div>
                    <div class="brand-name">GanadoVision</div>
                    <div class="brand-sub">Sistema de monitoreo feedlot</div>
                </div>
            </div>

            <div class="left-body">
                <div class="badge-live">
                    <div class="dot-live">
                        <span class="ping"></span>
                        <span></span>
                    </div>
                    Sistema activo — Monitoreo en tiempo real
                </div>

                <h1 class="left-title">
                    Monitoreo<br>
                    <em>inteligente</em><br>
                    de ganado
                </h1>

                <p class="left-desc">
                    Visión artificial, trazabilidad completa y alertas automáticas para la gestión eficiente de tu feedlot.
                </p>

                <div class="stats-row">
                    <div class="stat-card">
                        <div class="stat-num">24/7</div>
                        <div class="stat-lbl">Monitoreo</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-num accent">YOLO</div>
                        <div class="stat-lbl">Detección IA</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-num">100%</div>
                        <div class="stat-lbl">Trazabilidad</div>
                    </div>
                </div>
            </div>

            <div class="left-footer">GanadoVision &copy; {{ date('Y') }}</div>
        </div>

        {{-- Panel derecho — card formulario --}}
        <div class="panel-right">
            <div class="form-card">

                {{-- Logo solo en mobile --}}
                <div class="mobile-brand">
                    <div class="mobile-brand-icon">
                        <svg fill="none" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                    </div>
                    <span class="mobile-brand-name">GanadoVision</span>
                </div>

                <div class="form-tag">Bienvenido de vuelta</div>
                <div class="form-title">Accedé al<br>sistema</div>
                <div class="form-sub">Ingresá tus credenciales para continuar</div>

                @if($errors->any())
                <div class="alert-error">
                    <div class="alert-icon">
                        <svg viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div>
                        <div class="alert-title">Credenciales incorrectas</div>
                        <div class="alert-msg">{{ $errors->first() }}</div>
                    </div>
                </div>
                @endif

                <form method="POST" action="{{ route('login') }}">
                    @csrf

                    <div class="field-group">
                        <label class="field-label">Correo electrónico</label>
                        <div class="field-wrap">
                            <div class="field-icon">
                                <svg fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <input type="email" name="email" value="{{ old('email') }}"
                                   class="field-input" placeholder="usuario@ejemplo.com"
                                   required autofocus>
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Contraseña</label>
                        <div class="field-wrap">
                            <div class="field-icon">
                                <svg fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>
                            </div>
                            <input :type="showPass ? 'text' : 'password'" name="password"
                                   class="field-input" placeholder="••••••••" required>
                            <button type="button" class="field-toggle" @click="showPass = !showPass">
                                <svg x-show="!showPass" fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </svg>
                                <svg x-show="showPass" fill="none" viewBox="0 0 24 24" style="display:none">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="remember-row">
                        <input type="checkbox" id="remember" name="remember">
                        <label for="remember">Recordarme</label>
                    </div>

                    <button type="submit" class="btn-submit">
                        Iniciar sesión
                        <svg fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>
                    </button>
                </form>

                <div class="card-footer">
                    <div class="dot-online">
                        <span class="ping"></span>
                        <span></span>
                    </div>
                    Sistema operativo
                    <span class="card-sep">·</span>
                    GanadoVision &copy; {{ date('Y') }}
                </div>

            </div>
        </div>

    </div>
</body>
</html>
