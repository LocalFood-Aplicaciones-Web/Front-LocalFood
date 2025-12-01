<script setup>
</script>

<template>
 <section class="content">
   <div class="buscador">
    <input type="text" placeholder="Buscar Persona (Nombre de usuario o Codigo)">
    <button class="btn-conocidos">Conocidos</button>
    <button class="btn-nuevo">Nuevo</button>
   </div>

  <div class="upload-section">
    <p class="texto-subir">Presion el icono para subir QR y poder encontrar a la persona en cuestion</p>

    <div class="icono-upload">
      <img src="https://lobbyfix.com/wp-content/uploads/2020/11/qr-code.png" alt="QR">
      <i class="fas fa-cloud-upload-alt"></i>
    </div>
  </div>

  <div class="colegas-lista">
    <div class="colega-card">
      <img src="https://randomuser.me/api/portraits/women/60.jpg" alt="Jenny Pareto">
      <div class="info">
        <h3><span>Jenny pareto</span></h3>
        <p>Código: BVALIS47</p>
        <button class="btn-invitar">Invitar a lista</button>
      </div>
    </div>

    <div class="colega-card2">
      <img src="https://e0.pxfuel.com/wallpapers/147/746/desktop-wallpaper-coolest-anime-profile-page-1.jpg" alt="JohanDB">
      <div class="info">
        <h3><span>JohanDB</span></h3>
        <p>Código: ACTAL32</p>
        <button class="btn-invitar">Invitar a lista</button>
      </div>
    </div>

    <div class="colega-card">
      <img src="https://randomuser.me/api/portraits/men/66.jpg" alt="Pepito Gonzalo">
      <div class="info">
        <h3><span>Pepito gonzalo</span></h3>
        <p>Código: RRRLE67</p>
        <button class="btn-invitar">Invitar a lista</button>
      </div>
    </div>

    <div class="colega-card2">
      <img src="https://pm1.aminoapps.com/8408/485ae539a8747e6094bcaf6545d2bf8abec33a6cr1-1440-1440v2_hq.jpg" alt="JohanDB">
      <div class="info">
        <h3><span>LilianKitti</span></h3>
        <p>Código: BMNTL99</p>
        <button class="btn-invitar">Invitar a lista</button>
      </div>
    </div>
  </div>
 </section>
</template>

<style scoped>
.content {
  flex: 1;
  padding: 40px;
  background-color: #f4f4f4;
  height: 100vh;
  overflow-y: auto;
}


.buscador {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.buscador input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.btn-conocidos {
  background-color: #555;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}

.btn-nuevo {
  background-color: #90EE90;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}
.colega-card2 img {
  width: 130px;        /* o usa height si prefieres */
  height: 130px;
  object-fit: cover;  /* mantiene proporciones sin deformar */
 
}
.icono-upload {
  position: relative;
  width: 500px;
  height: 500px;
  margin: 20px auto;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}


</style>