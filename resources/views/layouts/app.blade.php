<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'GanadoVision')</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', sans-serif;
            background: #f5f6fa;
            color: #111827;
            min-height: 100vh;
        }

        /* ── NAVBAR ── */
        .navbar {
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 64px;
            background: #fff;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            z-index: 100;
            box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .navbar-left  { display: flex; align-items: center; gap: 12px; }
        .navbar-right { display: flex; align-items: center; gap: 12px; }

        .nav-menu-btn {
            display: none;
            align-items: center; justify-content: center;
            width: 36px; height: 36px;
            border-radius: 8px;
            border: none;
            background: #f3f4f6;
            cursor: pointer;
            color: #6b7280;
        }
        .nav-menu-btn:hover { background: #e5e7eb; }
        .nav-menu-btn svg  { width: 18px; height: 18px; stroke: currentColor; }
        @media (max-width: 1023px) { .nav-menu-btn { display: flex; } }

        .nav-brand {
            display: flex; align-items: center; gap: 10px;
            text-decoration: none;
        }
        .nav-brand-icon {
            width: 34px; height: 34px;
            border-radius: 9px;
            background: #2D6A2D;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .nav-brand-icon svg { width: 18px; height: 18px; stroke: white; fill: none; }
        .nav-brand-name {
            font-size: 16px;
            font-weight: 700;
            color: #111827;
            letter-spacing: -0.3px;
        }

        /* Usuario dropdown */
        .user-btn {
            display: flex; align-items: center; gap: 10px;
            padding: 6px 10px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            background: #fff;
            cursor: pointer;
            transition: background .15s, border-color .15s;
        }
        .user-btn:hover { background: #f9fafb; border-color: #d1d5db; }
        .user-info { text-align: right; }
        .user-name  { font-size: 13px; font-weight: 600; color: #111827; line-height: 1.3; }
        .user-role  { font-size: 11px; color: #2D6A2D; font-weight: 500; }
        .user-avatar {
            width: 32px; height: 32px;
            border-radius: 50%;
            background: #2D6A2D;
            color: white;
            font-size: 13px;
            font-weight: 700;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .user-dropdown {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            width: 220px;
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            overflow: hidden;
            z-index: 200;
        }
        .dropdown-header {
            padding: 14px 16px;
            border-bottom: 1px solid #f3f4f6;
            background: #f9fafb;
        }
        .dropdown-header .dn { font-size: 13px; font-weight: 600; color: #111; }
        .dropdown-header .dr { font-size: 11px; color: #2D6A2D; margin-top: 2px; }
        .dropdown-item {
            display: flex; align-items: center; gap: 10px;
            padding: 11px 16px;
            font-size: 13px;
            color: #374151;
            text-decoration: none;
            cursor: pointer;
            background: none;
            border: none;
            width: 100%;
            font-family: 'Inter', sans-serif;
            transition: background .1s;
        }
        .dropdown-item:hover { background: #f9fafb; }
        .dropdown-item.danger { color: #dc2626; }
        .dropdown-item svg { width: 15px; height: 15px; stroke: currentColor; flex-shrink: 0; }

        /* ── SIDEBAR ── */
        .sidebar {
            position: fixed;
            top: 64px; left: 0; bottom: 0;
            width: 240px;
            background: #fff;
            border-right: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            z-index: 90;
            transition: transform .25s ease, width .25s ease;
            overflow-y: auto;
        }
        .sidebar.collapsed { width: 64px; }
        @media (max-width: 1023px) {
            .sidebar { transform: translateX(-100%); }
            .sidebar.open { transform: translateX(0); }
            .sidebar.collapsed { width: 240px; }
        }

        .sidebar-nav { padding: 16px 10px; flex: 1; }

        .nav-section-label {
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #9ca3af;
            padding: 8px 10px 4px;
            white-space: nowrap;
            overflow: hidden;
        }
        .sidebar.collapsed .nav-section-label { opacity: 0; }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 11px;
            padding: 10px 10px;
            border-radius: 10px;
            text-decoration: none;
            color: #6b7280;
            font-size: 14px;
            font-weight: 500;
            transition: background .12s, color .12s;
            white-space: nowrap;
            overflow: hidden;
            margin-bottom: 2px;
        }
        .nav-item:hover { background: #f3f4f6; color: #111827; }
        .nav-item.active {
            background: #eef6ee;
            color: #2D6A2D;
            font-weight: 600;
        }
        .nav-item svg {
            width: 18px; height: 18px;
            stroke: currentColor;
            fill: none;
            flex-shrink: 0;
        }
        .nav-item span { overflow: hidden; }
        .sidebar.collapsed .nav-item span { display: none; }
        .sidebar.collapsed .nav-item { justify-content: center; padding: 10px; }

        /* Badge de alertas en el sidebar */
        .nav-badge {
            display: inline-flex; align-items: center; justify-content: center;
            min-width: 18px; height: 18px;
            padding: 0 5px;
            border-radius: 999px;
            background: #C94A3F;
            color: #fff;
            font-size: 10px;
            font-weight: 700;
            line-height: 1;
            margin-left: auto;
            flex-shrink: 0;
        }
        .sidebar.collapsed .nav-badge {
            position: absolute;
            top: 6px; right: 6px;
            min-width: 14px; height: 14px;
            font-size: 9px;
            padding: 0 3px;
        }
        .nav-item { position: relative; }

        /* Botón colapsar */
        .sidebar-collapse-btn {
            margin: 8px 10px 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 9px 10px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            background: #f9fafb;
            cursor: pointer;
            font-size: 13px;
            color: #6b7280;
            font-family: 'Inter', sans-serif;
            transition: background .12s;
            white-space: nowrap;
            overflow: hidden;
        }
        .sidebar-collapse-btn:hover { background: #f3f4f6; color: #374151; }
        .sidebar-collapse-btn svg { width: 15px; height: 15px; stroke: currentColor; flex-shrink: 0; transition: transform .25s; }
        .sidebar.collapsed .sidebar-collapse-btn svg { transform: rotate(180deg); }
        .sidebar.collapsed .sidebar-collapse-btn span { display: none; }
        .sidebar.collapsed .sidebar-collapse-btn { justify-content: center; padding: 9px; }
        @media (max-width: 1023px) { .sidebar-collapse-btn { display: none; } }

        /* Overlay móvil */
        .sidebar-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            z-index: 80;
        }
        .sidebar-overlay.visible { display: block; }

        /* ── CONTENIDO PRINCIPAL ── */
        .main-content {
            margin-top: 64px;
            margin-left: 240px;
            padding: 28px 28px;
            min-height: calc(100vh - 64px);
            transition: margin-left .25s ease;
        }
        .main-content.collapsed { margin-left: 64px; }
        @media (max-width: 1023px) { .main-content { margin-left: 0; } }

        /* ── FLASH MESSAGES ── */
        .flash-success {
            display: flex; align-items: center; gap: 10px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 12px 16px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #166534;
        }
        .flash-error {
            display: flex; align-items: center; gap: 10px;
            background: #fff1f0;
            border: 1px solid #fecaca;
            border-radius: 12px;
            padding: 12px 16px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #991b1b;
        }
        .flash-success svg, .flash-error svg { width: 16px; height: 16px; stroke: currentColor; flex-shrink: 0; }
    </style>
</head>
<body x-data="{
    sidebarOpen: false,
    sidebarCollapsed: false,
    userMenuOpen: false
}">

{{-- Overlay móvil --}}
<div :class="sidebarOpen ? 'visible' : ''"
     class="sidebar-overlay"
     @click="sidebarOpen = false"></div>

{{-- ══ NAVBAR ══ --}}
<header class="navbar">
    <div class="navbar-left">
        <button class="nav-menu-btn" @click="sidebarOpen = !sidebarOpen" aria-label="Menú">
            <svg fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        </button>
        <a href="{{ route('dashboard') }}" class="nav-brand">
            <div class="nav-brand-icon">
                <svg stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
            </div>
            <span class="nav-brand-name">GanadoVision</span>
        </a>
    </div>

    <div class="navbar-right">
        <div style="position:relative" x-data @click.outside="userMenuOpen = false">
            <button class="user-btn" @click="userMenuOpen = !userMenuOpen">
                <div class="user-info">
                    <div class="user-name">{{ auth()->user()->name ?? 'Usuario' }}</div>
                    <div class="user-role">{{ auth()->user()->role ?? 'Administrador' }}</div>
                </div>
                <div class="user-avatar">
                    {{ strtoupper(substr(auth()->user()->name ?? 'U', 0, 1)) }}
                </div>
            </button>

            <div class="user-dropdown" x-show="userMenuOpen" x-cloak>
                <div class="dropdown-header">
                    <div class="dn">{{ auth()->user()->name ?? 'Usuario' }}</div>
                    <div class="dr">{{ auth()->user()->role ?? 'Administrador' }}</div>
                </div>
                <a href="#" class="dropdown-item">
                    <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    Mi perfil
                </a>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="dropdown-item danger">
                        <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        Cerrar sesión
                    </button>
                </form>
            </div>
        </div>
    </div>
</header>

{{-- ══ SIDEBAR ══ --}}
<aside class="sidebar"
       :class="{
           'open': sidebarOpen,
           'collapsed': sidebarCollapsed
       }">

    <nav class="sidebar-nav">
        <div class="nav-section-label">Principal</div>

        @php
        $menu = [
            ['label' => 'Dashboard',     'route' => 'dashboard',     'icon' => 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'],
            ['label' => 'Animales',      'route' => 'animales.index', 'icon' => 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'],
            ['label' => 'Corrales',      'route' => 'corrales.index', 'icon' => 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'],
            ['label' => 'Alertas',       'route' => 'alertas.index',  'icon' => 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'],
            ['label' => 'Configuración', 'route' => 'configuracion',  'icon' => 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'],
        ];
        @endphp

        @foreach($menu as $item)
            @php $active = request()->routeIs($item['route']); @endphp
            <a href="{{ route($item['route']) }}"
               class="nav-item {{ $active ? 'active' : '' }}"
               title="{{ $item['label'] }}">
                <svg viewBox="0 0 24 24" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="{{ $item['icon'] }}"/>
                </svg>
                <span>{{ $item['label'] }}</span>
                @if($item['route'] === 'alertas.index' && ($alertasBadge ?? 0) > 0)
                    <span class="nav-badge">{{ $alertasBadge > 99 ? '99+' : $alertasBadge }}</span>
                @endif
            </a>
        @endforeach
    </nav>

    <button class="sidebar-collapse-btn"
            @click="sidebarCollapsed = !sidebarCollapsed"
            title="Colapsar menú">
        <svg viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
        </svg>
        <span>Colapsar</span>
    </button>
</aside>

{{-- ══ CONTENIDO ══ --}}
<main class="main-content" :class="{ 'collapsed': sidebarCollapsed }">

    @if(session('success'))
    <div class="flash-success">
        <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        {{ session('success') }}
    </div>
    @endif

    @if(session('error'))
    <div class="flash-error">
        <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        {{ session('error') }}
    </div>
    @endif

    @yield('content')
</main>

</body>
</html>
