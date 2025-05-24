'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ASLCharacter, getASLCharacters, ASLCharName } from '../../models/characters'; // Adjusted path

interface ASLCharacterContextType {
    characters: Map<ASLCharName, ASLCharacter>;
    isLoading: boolean;
    error: string | null;
    getCharacter: (charName: ASLCharName) => ASLCharacter | undefined;
}

const ASLCharacterContext = createContext<ASLCharacterContextType | undefined>(undefined);

interface ASLCharacterProviderProps {
    children: ReactNode;
}

export const ASLCharacterProvider: React.FC<ASLCharacterProviderProps> = ({ children }) => {
    const [characters, setCharacters] = useState<Map<ASLCharName, ASLCharacter>>(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCharacters = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const aslData = await getASLCharacters();
                const charMap = new Map<ASLCharName, ASLCharacter>();
                aslData.forEach(char => {
                    charMap.set(char.char_name, char);
                });
                setCharacters(charMap);
            } catch (err) {
                console.error("Error fetching ASL characters in Context:", err);
                setError(err instanceof Error ? err.message : "Failed to load ASL character data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCharacters();
    }, []);

    const getCharacter = (charName: ASLCharName): ASLCharacter | undefined => {
        return characters.get(charName);
    };

    return (
        <ASLCharacterContext.Provider value={{ characters, isLoading, error, getCharacter }}>
            {children}
        </ASLCharacterContext.Provider>
    );
};

export const useASLCharacters = (): ASLCharacterContextType => {
    const context = useContext(ASLCharacterContext);
    if (context === undefined) {
        throw new Error('useASLCharacters must be used within an ASLCharacterProvider');
    }
    return context;
}; 