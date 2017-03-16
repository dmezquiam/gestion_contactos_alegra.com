<?php
    require('contacto.php');

    $obj_contacto = new Contacto();

    //Obtener metodo de peticion HTTP --> POST, GET, PUT...
    $metodo =  $_SERVER["REQUEST_METHOD"]; 
    
    if ($metodo == 'GET') {
        echo $obj_contacto->listar_contactos();
    }
    // Aqui el metodo POST es usado para PUT y DELETE tambien, con distintas condiciones
    elseif ($metodo == 'POST') {
        // Si la variable delete existe, es que se esta haciendo una peticion para eliminar,
        // pero no por DELETE, sino por POST
        if (isset($_POST['delete'])) {
            $id = $_POST['id'];
            echo $obj_contacto->eliminar_contacto($id);
        }
        // Si variable pull existe, enviar datos para editarlos
        elseif(isset($_POST['pull'])) {
            $id = $_POST['id'];
            $nombre = $_POST['name'];
            $iden = $_POST['iden'];
            //$direccion = $_POST['direccion'];
            //$ciudad =  $_POST['ciudad'];
            //$email= $_POST['email'];
            $telef1 = $_POST['telef1'];
            //$telef2 = $_POST['telef2'];
            //$fax = $_POST['fax'];
            //$cell = $_POST['cell'];
            $observ  = $_POST['observaciones'];
            //$address = array(
            //        'address' => $direccion,
            //        'city' => $ciudad,
            //);
            echo $obj_contacto->editar_contacto($id, $nombre, $iden, $telef1, $telef2, $fax, $cell, $observ, $email, $pricelist = NULL, $vendedor = null, $term = null, (object)$address, $type = 'client' , $internalContacts = null);
        }
        else {
            // Si las variables delete y pull no existen es que se esta solicitando guardar datos por POST
            $nombre = $_POST['name'];
            $iden = $_POST['iden'];
            $direccion = $_POST['direccion'];
            $ciudad =  $_POST['ciudad'];
            $email= $_POST['email'];
            $telef1 = $_POST['telef1'];
            $telef2 = $_POST['telef2'];
            $fax = $_POST['fax'];
            $cell = $_POST['cell'];
            $observ  = $_POST['observaciones'];
            $address = array(
                    'address' => $direccion,
                    'city' => $ciudad,
            );
            echo $obj_contacto->agregar_contacto($nombre, $iden, $telef1, $telef2, $fax, $cell, $observ, $email, $exist = true, $pricelist = NULL, $vendedor = null, $term = null, (object)$address, $type = 'client' , $internalContacts = null);
        }
    }
    
    
   
