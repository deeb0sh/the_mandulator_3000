<template>
    <div class="wrapper">
        <RouterView /> 
         
    </div>
    <Footer txt="&copy 2025 ebosh-product"/>
</template>

<script>
export default {
    data() {
        return {
            
        };
    }
}
</script>

<style scoped>
/* * {
    border: red solid 1px;
} */

:global(html) {
    width: 100%;
    height: 100%; 
}

:global(body) {
    width: 100%;
    height: 100%;
    background-image: url('./img/fon.png');
    font-family: "sber";
    font-size: 14px;
    color: #313131;
    margin: 0;
}

.wrapper {
	display: flex;
    flex-direction: column;
	align-items: center;
    min-height: 97vh;
    width: 100%;
}


@font-face {
    font-family: 'sber';
    src: url('./fonts/sber.ttf') format('truetype');
}

@font-face {
    font-family: 'HH';
    src: url('./fonts/HH2.ttf') format('truetype');
}

</style>

