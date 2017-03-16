<?php

class Contacto {

    function __construct() {}
    
    // Funcion para agregar un contacto en alegra.com
    public function agregar_contacto($name, $ident, $telef1, $telef2, $fax, $cell, $observ, $email, $exist, $pricelist, $vendedor, $term, $address, $type, $internalContacts) { 
      // Inicializar una sesion cURL
      $curl = curl_init('https://app.alegra.com/api/v1/contacts');

      // Datos a guardar del contacto
      $curl_post_data = array(
          'name' => $name,
          'identification' => $ident,
          'address' => $address,
          'email' => $email,
          'phonePrimary' => $telef1,
          'phoneSecondary' => $telef2,
          'fax' => $fax,
          'ignoreRepeated' => $exist,
          'type' => $type,
          'internalContacts' => $internalContacts,
          'mobile' => $cell,
          'term' => $term,
          'priceList' => $pricelist,
          'seller' => $vendedor,
          'observations' => $observ
      );
      //Convertir de Array a string JSON
      $jsonArray = json_encode($curl_post_data);

      // LLamada a la funcion ejecutar_curl() para configurar los datos de envio
      $this->ejecutar_curl($jsonArray, $curl, 'POST');
    }

    // Funcion para mostrar todos los contactos registrados en alegra.com
    public function listar_contactos() { 
      // Inicializar una sesion cURL
      $curl = curl_init('https://app.alegra.com/api/v1/contacts/?start=0');

      // LLamada a la funcion ejecutar_curl() para configurar los datos de envio
      $result = $this->ejecutar_curl(null, $curl, 'GET');
      return json_encode(json_decode($result, true));
    }

    // Funcion para eliminar un contacto en alegra.com dado su id
    public function eliminar_contacto($id) { 
      // Inicializar una sesion cURL
      $curl = curl_init('https://app.alegra.com/api/v1/contacts/'.$id);

      // LLamada a la funcion ejecutar_curl() para configurar los datos de envio
      $this->ejecutar_curl(null, $curl, 'DELETE');
    }

    // Funcion para editar un contacto en alegra.com dado su id
    public function editar_contacto($id, $name, $ident, $telef1, $telef2, $fax, $cell, $observ, $email, $pricelist, $vendedor, $term, $address, $type, $internalContacts) { 
      // Inicializar una sesion cURL
      $curl = curl_init('https://app.alegra.com/api/v1/contacts/'.$id);

      // Datos a editar
      $curl_post_data = array(
          'name' => $name,
          'identification' => $ident,
          'address' => $address,
          'email' => $email,
          'phonePrimary' => $telef1,
          'phoneSecondary' => $telef2,
          'fax' => $fax,
          'type' => $type,
          'internalContacts' => $internalContacts,
          'mobile' => $cell,
          'term' => $term,
          'priceList' => $pricelist,
          'seller' => $vendedor,
          'observations' => $observ
      );
      //Convertir de Array a string JSON
      $jsonArray = json_encode($curl_post_data);

      // LLamada a la funcion ejecutar_curl() para configurar los datos de envio
      $this->ejecutar_curl($jsonArray, $curl, 'PUT');
    }
    
    // Funcion para confgurar y establecer todas las opciones para la transferencia de datos por curl
    private function ejecutar_curl($jsonArray, $curl, $type_metodo) {
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 
                                                     'authorization: Basic ' . base64_encode('usuario@dominio.com'. ':' .'token') 
                                                    )); 
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true); 
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        // Si hay que modificar datos...
        if ($type_metodo == 'PUT') {
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
            curl_setopt($curl, CURLOPT_POST, true); 
            curl_setopt($curl, CURLOPT_POSTFIELDS, $jsonArray);
        }
        // Si hay que guardar datos...
        elseif ($type_metodo == 'POST') {
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($curl, CURLOPT_POST, true); 
            curl_setopt($curl, CURLOPT_POSTFIELDS, $jsonArray);
        }
        // Si hay que mostrar datos...
        elseif ($type_metodo == 'GET') {
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "GET");
        }
        else {
            // Si hay que eliminar datos...
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
        }
        // Ejecutar la url y la funcion pasada por $curl
        $output = curl_exec($curl);
        //print_r($output);

        //Cerrar sesion cURL
        curl_close($curl);

        if($output === false){
            echo "Error Number:".curl_errno($curl)."<br>";
            echo "Error String:".curl_error($curl);
        }
        return $output;
    }
}