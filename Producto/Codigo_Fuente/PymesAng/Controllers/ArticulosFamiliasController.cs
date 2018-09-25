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

namespace PymesAng
{
    public class ArticulosFamiliasController : ApiController
    {
        private PymesEntities db = new PymesEntities();

        // GET api/ArticulosFamilias
        public IQueryable<ArticulosFamilias> GetArticulosFamilias()
        {
            return db.ArticulosFamilias;
        }

        // GET api/ArticulosFamilias/5
        [ResponseType(typeof(ArticulosFamilias))]
        public IHttpActionResult GetArticulosFamilias(int id)
        {
            ArticulosFamilias articulosfamilias = db.ArticulosFamilias.Find(id);
            if (articulosfamilias == null)
            {
                return NotFound();
            }

            return Ok(articulosfamilias);
        }

        // PUT api/ArticulosFamilias/5
        public IHttpActionResult PutArticulosFamilias(int id, ArticulosFamilias articulosfamilias)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != articulosfamilias.IdArticuloFamilia)
            {
                return BadRequest();
            }

            db.Entry(articulosfamilias).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArticulosFamiliasExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/ArticulosFamilias
        [ResponseType(typeof(ArticulosFamilias))]
        public IHttpActionResult PostArticulosFamilias(ArticulosFamilias articulosfamilias)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ArticulosFamilias.Add(articulosfamilias);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = articulosfamilias.IdArticuloFamilia }, articulosfamilias);
        }

        // DELETE api/ArticulosFamilias/5
        [ResponseType(typeof(ArticulosFamilias))]
        public IHttpActionResult DeleteArticulosFamilias(int id)
        {
            ArticulosFamilias articulosfamilias = db.ArticulosFamilias.Find(id);
            if (articulosfamilias == null)
            {
                return NotFound();
            }

            db.ArticulosFamilias.Remove(articulosfamilias);
            db.SaveChanges();

            return Ok(articulosfamilias);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ArticulosFamiliasExists(int id)
        {
            return db.ArticulosFamilias.Count(e => e.IdArticuloFamilia == id) > 0;
        }
    }
}