# Sistema de Gestión de Holding Empresarial

Aplicación web *Full-Stack* desarrollada con **Java + Spring Boot + MySQL** en el backend y **React + Vite** en el frontend para la administración integral de empresas, países sede, fuerza de ventas piramidal, áreas de mercado y asesores con auditoría temporal.

## Arquitectura y Módulos

- **Empresas y Países Sede:** Gestión de compañías del holding vinculadas a sus países de radicación (`@ManyToOne`) con indicadores macroeconómicos y facturación anual.
- **Vendedores y Red Piramidal:** Estructura jerárquica autorreferencial (`captador` / `captados`) con validación de pertenencia a la misma empresa y registro automático de fecha de captación.
- **Áreas de Mercado:** Catálogo sectorial con relación muchos a muchos (`@ManyToMany`) frente a las empresas del grupo.
- **Asesores y Asignaciones:** Entidad asociativa ternaria (`Asesor` + `Empresa` + `Área de Mercado`) con auditoría temporal automática (`fechaInicio`) y validación de coherencia sectorial.

## Requisitos Previos

- Java 17 o superior
- Node.js 18 o superior
- MySQL Server corriendo en el puerto `3306`

## Instrucciones de Ejecución

### 1. Base de Datos
Crear la base de datos vacía en MySQL:
```sql
CREATE DATABASE holding_db;