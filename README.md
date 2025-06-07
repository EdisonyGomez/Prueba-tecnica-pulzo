# 🚀 Explorador de Rick & Morty - Angular con Arquitectura Limpia



## 📌 Descripción

Aplicación web para explorar el universo de Rick & Morty implementando:

✔ **Arquitectura limpia** (Domain, Data, Presentation)  
✔ **Angular 20** con TypeScript  
✔ **Tailwind CSS** para estilos  
✔ **Firebase Hosting** para despliegue  
✔ **RxJS** para manejo reactivo  

🔗 **Demo**: [https://prueba-pulzo.web.app/home](https://prueba-pulzo.web.app/home)

## 🏗 Estructura del Proyecto
src/
├── 📂 data/ # Infraestructura y APIs
│ ├── repositories/
│ └── datasources/
│
├── 📂 domain/ # Lógica de negocio
│ ├── entities/
│ ├── repositories/
│ └── usecases/
│
└── 📂 presentation/ # Interfaz de usuario
├── pages/
├── components/
└── shared/

## 🚀 Cómo Ejecutar

```bash
git clone [repo-url]
cd rick-morty-app
npm install
ng serve