using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Datos;

namespace PymesAng.Controllers
{
    public class ArticulosController : ApiController
    {
        //ref webapi; por defecto se busca el metodo de request (get, post, etc) segun comienze el nombre de la accion y sus parametros 
        //GET: api/Articulos
        public IHttpActionResult GetArticulos(string Nombre = "", bool? Activo = null, int numeroPagina = 1)
        {
            //ref webapi parametros;
            //ref webapi tipos de retorno de los metodos; cambiamos la devolucion generica del metodo: IQueryable<Articulos> por IHttpActionResult para poder devolver tambien RegistrosTotal
            int RegistrosTotal;
            //ref c#  var
            var Lista = Datos.GestorArticulos.Buscar(Nombre, Activo, numeroPagina, out RegistrosTotal);
            return Ok(new { Lista = Lista, RegistrosTotal = RegistrosTotal });
            // en cliente angular vemos response.data.Lista y response.data.RegistroTotal
        }


        // GET: api/Articulos/5
        [ResponseType(typeof(Articulos))]
        public IHttpActionResult GetArticulos(int id)
        {
            Articulos articulos = Datos.GestorArticulos.BuscarPorId(id);
            //ref Ado generar objeto generico
            //Articulos articulos = Datos.GestorArticulos.ADOBuscarPorId(id);
            if (articulos == null)
            {
                return NotFound();  // status 404
            }
            return Ok(articulos);   // en cliente vemos response.data
        }

        //ref seguridad; autorizar una controlado o una accion segun el usuario o rol de usuario logueado
        // En este caso solo aplica a esta accion
        //[Authorize(Roles = "administradores")]  // solo rol administradores
        // PUT: api/Articulos/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutArticulos(int id, Articulos articulos)
        {
            if (!ModelState.IsValid)  //ref DataAnnotations; validar en el servidor ??
            {
                return BadRequest(ModelState);
            }

            if (id != articulos.IdArticulo)
            {
                return BadRequest();
            }

            Datos.GestorArticulos.Grabar(articulos);

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Articulos
        [ResponseType(typeof(Articulos))]
        public IHttpActionResult PostArticulos(Articulos articulos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Datos.GestorArticulos.Grabar(articulos);

            return CreatedAtRoute("DefaultApi", new { id = articulos.IdArticulo }, articulos);
        }

        //DELETE: api/Articulos/1 
        [ResponseType(typeof(Articulos))]
        public IHttpActionResult DeleteArticulos(int id)
        {
            //new ApplicationException("error en base");   //ref??? throw no genera error dentro de webapi, continua normalmente?

            //ref EntityFramework baja logica
            Datos.GestorArticulos.ActivarDesactivar(id);
            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}