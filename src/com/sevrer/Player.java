package com.sevrer;

import java.util.HashSet;
import java.util.Set;

public class Player {
    private String tiles;

    public Player() {
        tiles = "";
    }

    public void addTile(String tile) {
        // Retorna verdadeiro se o tile ainda não existir e é adicionado
        tiles=tile;
    }

    public boolean hasTile(String tile) {
        // Verifica se o tile já existe
        return tiles.contains(tile);
    }

    public void clearTiles() {
        // Limpa todos os tiles
        tiles="";
    }
}
