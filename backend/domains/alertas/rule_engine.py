from typing import Any


class CondicionInvalidaError(ValueError):
    pass


def obtener_valor(payload: dict[str, Any], campo: str) -> Any:
    valor: Any = payload
    for parte in campo.split("."):
        if not isinstance(valor, dict) or parte not in valor:
            return None
        valor = valor[parte]
    return valor


def evaluar_condicion(condicion: dict[str, Any], payload: dict[str, Any]) -> bool:
    """
    Evalúa condiciones configurables en JSON.

    Formatos soportados:
    {"campo": "peso_kg", "op": "<", "valor": 280}
    {"and": [condicion1, condicion2]}
    {"or": [condicion1, condicion2]}
    {"not": condicion}
    """
    if not condicion:
        raise CondicionInvalidaError("La condición no puede estar vacía")

    if "and" in condicion:
        return all(evaluar_condicion(item, payload) for item in condicion["and"])

    if "or" in condicion:
        return any(evaluar_condicion(item, payload) for item in condicion["or"])

    if "not" in condicion:
        return not evaluar_condicion(condicion["not"], payload)

    campo = condicion.get("campo")
    operador = condicion.get("op")
    esperado = condicion.get("valor")

    if campo is None or operador is None:
        raise CondicionInvalidaError("La condición debe incluir campo y op")

    actual = obtener_valor(payload, campo)

    if operador == "==":
        return actual == esperado
    if operador == "!=":
        return actual != esperado
    if operador == ">":
        return actual is not None and actual > esperado
    if operador == ">=":
        return actual is not None and actual >= esperado
    if operador == "<":
        return actual is not None and actual < esperado
    if operador == "<=":
        return actual is not None and actual <= esperado
    if operador == "in":
        return actual in esperado if esperado is not None else False
    if operador == "contains":
        return esperado in actual if actual is not None else False

    raise CondicionInvalidaError(f"Operador no soportado: {operador}")


def construir_mensaje(nombre_regla: str, mensaje: str | None, payload: dict[str, Any]) -> str:
    if mensaje:
        try:
            return mensaje.format(**payload)
        except Exception:
            return mensaje
    return f"Regla activada: {nombre_regla}"
