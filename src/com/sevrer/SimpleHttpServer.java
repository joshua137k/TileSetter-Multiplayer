
package com.sevrer;


import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;




public class SimpleHttpServer {

	private static List<String> coordinatesStorage = new ArrayList<>();

	public static void main(String[] args) throws IOException {
		HttpServer server = HttpServer.create(new InetSocketAddress(8000),0);
		
		server.createContext("/", new MyHandler());
		server.createContext("/click", new ClickHandler());
		server.createContext("/coordinates", new CoordinatesHandler());
		server.createContext("/remove", new ClearHandler());

		server.createContext("/style.css", new StaticFileHandler("style.css"));
		server.createContext("/script.js", new StaticFileHandler("script.js"));
		server.createContext("/pencil.cur", new StaticFileHandler("pencil.cur"));
		server.createContext("/eraser.cur", new StaticFileHandler("eraser.cur"));
		
		server.start();
		System.out.println("Start");
		
	}
	
	


	static class  MyHandler implements HttpHandler {
		
		@Override
		public void handle(HttpExchange t) throws IOException{
			File file = new File("index.html").getAbsoluteFile();
			byte[] fileContent = Files.readAllBytes(file.toPath());
			t.sendResponseHeaders(200, file.length());
			OutputStream os = t.getResponseBody();
			os.write(fileContent);
			os.close();
			
		}
		
	}

	static class CoordinatesHandler implements HttpHandler {
	    @Override
	    public void handle(HttpExchange t) throws IOException {
	    	String coordinatesJson = String.join("p", coordinatesStorage);

	        // Define o tipo de conteúdo da resposta como JSON
	        t.getResponseHeaders().set("Content-Type", "application/json");

	        // Envia os dados como resposta
	        t.sendResponseHeaders(200, coordinatesJson.length());
	        OutputStream os = t.getResponseBody();
	        os.write(coordinatesJson.getBytes());
	        os.close();
	    	
	    }
	}
	
	static class ClearHandler implements HttpHandler {
	    @Override
	    public void handle(HttpExchange t) throws IOException {
	    	coordinatesStorage.clear();

	        t.getResponseHeaders().set("Content-Type", "application/json");
	        t.sendResponseHeaders(200, 1);

	    	
	    }
	}
	
	
	static class ClickHandler implements HttpHandler{
		@Override
		public void handle(HttpExchange t) throws IOException{
			Thread thread = new Thread(new ClickHandlerTask(t));
			thread.start();
			


		}
		
		
	}
	
	static class ClickHandlerTask implements Runnable{
		private HttpExchange t;
		
		public ClickHandlerTask(HttpExchange t) {
			this.t = t;
		}
		
		@Override
		public void run() {
			try {
				
				
				InputStream is = t.getRequestBody();
				String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);

				if (body.contains("\"erase\":false,")){
					body = body.replace("\"erase\":false,", "");
					String x = body.substring(body.indexOf("\"x\":") + 4, body.indexOf(","));
			        String y = body.substring(body.indexOf("\"y\":") + 4, body.indexOf(",", body.indexOf("\"y\":")));
					int a = getCoordinateIndex(x,y);
					 
			        if(a!=-1) {
			        	removeCoordinates(a);
					}
					storeCoordinates(body);
					
					
				}else {
					removeCoordinates(body);
				}
					
				
				
				
				t.sendResponseHeaders(200, 0);
				t.getResponseBody().close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		private int getCoordinateIndex(String x, String y) {
		    synchronized (coordinatesStorage) {
		        for (int i = 0; i < coordinatesStorage.size(); i++) {
		            String coordinate = coordinatesStorage.get(i);
		            if (coordinate.contains("\"x\":" + x) && coordinate.contains("\"y\":" + y)) {
		                return i; // Retorna o índice da coordenada encontrada
		            }
		        }
		    }
		    return -1; // Retorna -1 se a coordenada não for encontrada
		}
		
		private void storeCoordinates(String n) {
			coordinatesStorage.add(n);
		}
		
		private void removeCoordinates(String n) {
			coordinatesStorage.remove(n);
			
		}
		
		private void removeCoordinates(int n) {
			coordinatesStorage.remove(n);
			
		}
	}
	
	static class StaticFileHandler implements HttpHandler{
		private String filePath;
		
		public StaticFileHandler(String filePath) {
			this.filePath=filePath;
		}
		
		@Override
		public void handle(HttpExchange t) throws IOException{
			File file = new File(this.filePath).getAbsoluteFile();
			byte[] fileContent = Files.readAllBytes(file.toPath());
			
			t.sendResponseHeaders(200, file.length());
			OutputStream os = t.getResponseBody();
			os.write(fileContent);
			os.close();
		}
	}
	
	
}