function Camera() {
    //Sterowanie kamerą, chwilowo wersja dla ubogich
    document.addEventListener("keydown", onKeyDown, false)
    function onKeyDown(event) {

        var keyCode = event.which; // kod klawisza


        switch (keyCode) {


            case 87:

                // console.log("naciskasz w");
                if (camera.position.z > -820)
                camera.position.z -= 20
                break;

            case 83:
                //  console.log("naciskasz s");
                if (camera.position.z < 820)
                camera.position.z += 20
                break;

            case 65:
                //     console.log("naciskasz a");

                scene.rotation.y += 0.04
                break;

            case 68:
                scene.rotation.y -= 0.04
                //   console.log("naciskasz d");
                break;
            case 38:
                if (camera.position.y < 1320)
                camera.position.y += 10

                break;
            case 40:
                if (camera.position.y>30)
                camera.position.y -= 10
                break;

        }
    }
}