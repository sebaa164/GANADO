@extends('layouts.app')
@section('title', 'Registrar Animal — GanadoVision')

@section('content')
<div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 25px; border-radius: 12px; border: 1px solid #e5e7eb;">
    <h1 style="font-size: 20px; font-weight: 700; margin-bottom: 20px; color: #111827;">Registrar Nuevo Animal</h1>

    @if ($errors->any())
        <div style="background: #fff5f5; border: 1px solid #fecaca; color: #991b1b; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px;">
            <strong style="display: block; margin-bottom: 5px;">Por favor corrige los siguientes errores:</strong>
            <ul style="margin: 0; padding-left: 20px;">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('animales.store') }}" method="POST">
        @csrf

        <div style="margin-bottom: 16px;">
            <label for="codigo_caravana" style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px; color: #374151;">Código de Caravana *</label>
            <input type="text" id="codigo_caravana" name="codigo_caravana" value="{{ old('codigo_caravana') }}" required style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
            @error('codigo_caravana')
                <span style="color: #dc2626; font-size: 12px; display: block; margin-top: 4px;">{{ $message }}</span>
            @enderror
        </div>

        <div style="margin-bottom: 16px;">
            <label for="corral_id" style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px; color: #374151;">Corral *</label>
            <select id="corral_id" name="corral_id" required style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                <option value="">Seleccione un corral</option>
                @foreach($corrales as $corral)
                    <option value="{{ $corral->id }}" {{ old('corral_id') == $corral->id ? 'selected' : '' }}>
                        {{ $corral->nombre }} (Código: {{ $corral->codigo }})
                    </option>
                @endforeach
            </select>
            @error('corral_id')
                <span style="color: #dc2626; font-size: 12px; display: block; margin-top: 4px;">{{ $message }}</span>
            @enderror
        </div>

        <div style="margin-bottom: 16px;">
            <label for="raza" style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px; color: #374151;">Raza</label>
            <input type="text" id="raza" name="raza" value="{{ old('raza') }}" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
            @error('raza')
                <span style="color: #dc2626; font-size: 12px; display: block; margin-top: 4px;">{{ $message }}</span>
            @enderror
        </div>

        <div style="margin-bottom: 16px;">
            <label for="sexo" style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px; color: #374151;">Sexo *</label>
            <select id="sexo" name="sexo" required style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                <option value="">Seleccione el sexo</option>
                <option value="macho" {{ old('sexo') === 'macho' ? 'selected' : '' }}>Macho</option>
                <option value="hembra" {{ old('sexo') === 'hembra' ? 'selected' : '' }}>Hembra</option>
            </select>
            @error('sexo')
                <span style="color: #dc2626; font-size: 12px; display: block; margin-top: 4px;">{{ $message }}</span>
            @enderror
        </div>

        <div style="margin-bottom: 16px;">
            <label for="fecha_nacimiento" style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px; color: #374151;">Fecha de Nacimiento</label>
            <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" value="{{ old('fecha_nacimiento') }}" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
            @error('fecha_nacimiento')
                <span style="color: #dc2626; font-size: 12px; display: block; margin-top: 4px;">{{ $message }}</span>
            @enderror
        </div>

        <div style="margin-bottom: 16px;">
            <label for="fecha_ingreso" style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px; color: #374151;">Fecha de Ingreso *</label>
            <input type="date" id="fecha_ingreso" name="fecha_ingreso" value="{{ old('fecha_ingreso', date('Y-m-d')) }}" required style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
            @error('fecha_ingreso')
                <span style="color: #dc2626; font-size: 12px; display: block; margin-top: 4px;">{{ $message }}</span>
            @enderror
        </div>

        <div style="margin-bottom: 24px;">
            <label for="peso_ingreso_kg" style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px; color: #374151;">Peso de Ingreso (kg)</label>
            <input type="number" step="0.01" min="0" id="peso_ingreso_kg" name="peso_ingreso_kg" value="{{ old('peso_ingreso_kg') }}" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
            @error('peso_ingreso_kg')
                <span style="color: #dc2626; font-size: 12px; display: block; margin-top: 4px;">{{ $message }}</span>
            @enderror
        </div>

        <div style="display: flex; gap: 10px;">
            <button type="submit" style="background: #3B6D11; color: #fff; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">Guardar Registro</button>
            <a href="{{ route('animales.index') }}" style="background: #f3f4f6; color: #374151; padding: 10px 20px; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; text-decoration: none; display: inline-block; font-size: 14px; font-weight: 600; text-align: center;">Cancelar</a>
        </div>
    </form>
</div>
@endsection
