@extends('layouts.app')
@section('title', 'Nuevo Corral — GanadoVision')

@section('content')
<div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 25px; border-radius: 12px; border: 1px solid #e5e7eb;">
    <h1 style="font-size: 20px; font-weight: 700; margin-bottom: 20px; color: #111827;">Crear Nuevo Corral</h1>

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

    <form action="{{ route('corrales.store') }}" method="POST">
        @csrf

        <div style="margin-bottom: 16px;">
            <label for="nombre" style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px; color: #374151;">Nombre del Corral *</label>
            <input type="text" id="nombre" name="nombre" value="{{ old('nombre') }}" required style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
            @error('nombre')
                <span style="color: #dc2626; font-size: 12px; display: block; margin-top: 4px;">{{ $message }}</span>
            @enderror
        </div>

        <div style="margin-bottom: 16px;">
            <label for="codigo" style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px; color: #374151;">Código *</label>
            <input type="text" id="codigo" name="codigo" value="{{ old('codigo') }}" required style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
            @error('codigo')
                <span style="color: #dc2626; font-size: 12px; display: block; margin-top: 4px;">{{ $message }}</span>
            @enderror
        </div>

        <div style="margin-bottom: 16px;">
            <label for="capacidad_maxima" style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px; color: #374151;">Capacidad Máxima (Animales) *</label>
            <input type="number" min="1" id="capacidad_maxima" name="capacidad_maxima" value="{{ old('capacidad_maxima') }}" required style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
            @error('capacidad_maxima')
                <span style="color: #dc2626; font-size: 12px; display: block; margin-top: 4px;">{{ $message }}</span>
            @enderror
        </div>

        <div style="margin-bottom: 24px;">
            <label for="descripcion" style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px; color: #374151;">Descripción</label>
            <textarea id="descripcion" name="descripcion" rows="4" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; font-family: inherit;">{{ old('descripcion') }}</textarea>
            @error('descripcion')
                <span style="color: #dc2626; font-size: 12px; display: block; margin-top: 4px;">{{ $message }}</span>
            @enderror
        </div>

        <div style="display: flex; gap: 10px;">
            <button type="submit" style="background: #3B6D11; color: #fff; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">Guardar Corral</button>
            <a href="{{ route('corrales.index') }}" style="background: #f3f4f6; color: #374151; padding: 10px 20px; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; text-decoration: none; display: inline-block; font-size: 14px; font-weight: 600; text-align: center;">Cancelar</a>
        </div>
    </form>
</div>
@endsection
