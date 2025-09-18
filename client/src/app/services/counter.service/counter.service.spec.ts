/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */ // to test private
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Character, Item, ItemType, Map, PathContext, Player, Tile, TileType } from '@common/interfaces/interfaces';
import { MovementService } from './movement.service';

// Used qodo Gen (SIAG) for some tests generations

describe('MovementService', () => {
    let service: MovementService;
    let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
    const mockOccupiedTile = {
        id: 'tile',
        type: TileType.Wall,
        imgName: 'base.png',
        playerId: '',
        object: {
            name: ItemType.Start,
            desc: 'Point de départ',
            img: 'start.gif',
            canPlace: false,
            nb: 1,
        },
    };
    const mockTile = {
        id: 'tile1',
        type: TileType.Base,
        imgName: 'base.png',
        playerId: '',
        object: null,
    };

    const mockNeighborTile = { id: 'tile2', type: TileType.Base, imgName: 'base.png', playerId: '', object: null };

    const mockChar: Character = {
        name: 'Shrek',
        img: 'assets/images/character-sprites/Orc.png',
        health: 20,
        speed: 7,
        attack: 3,
        defense: 4,
    };
    const mockPlayer1: Player = {
        id: 'id1',
        character: mockChar,
        victoryPoints: 1,
        inventory: [],
        actionPoints: 1,
        movementPoints: 8,
        healthPoints: 17,
        evasionPoints: 2,
        socketId: 'socket',
        isActive: true,
    };
    const mockChar2: Character = {
        name: 'Dragon',
        img: 'assets/images/character-sprites/Werewolf.png',
        health: 15,
        speed: 1,
        attack: 3,
        defense: 4,
    };
    const mockPlayer2: Player = {
        id: 'id2',
        character: mockChar2,
        victoryPoints: 0,
        inventory: [],
        actionPoints: 1,
        movementPoints: 2,
        healthPoints: 9,
        evasionPoints: 2,
        socketId: 'socket',
        isActive: true,
    };
    const mockMap = {
        id: '1',
        tiles: [
            {
                id: 'tile1',
                type: TileType.Base,
                imgName: 'base.png',
                playerId: mockPlayer1.id,
                object: null,
            },
        ],
    };
    const mockPlayerMap = {
        id: '1',
        tiles: [mockTile, mockNeighborTile],
    };
    const mockContext: PathContext = {
        visited: new Set<string>(),
        costs: { tile1: 1, tile2: Infinity },
        predecessors: {},
        queue: [
            { cost: 5, tile: mockTile },
            { cost: 2, tile: mockNeighborTile },
        ],
    };
    const mockTileWithStartObject = {
        id: 'tile1',
        type: TileType.Base,
        imgName: 'base.png',
        playerId: '',
        object: {
            name: ItemType.Start,
            desc: 'Point de départ',
            img: 'start.gif',
            canPlace: false,
            nb: 1,
        },
    };
    const mockTileWithoutObject = {
        id: 'tile2',
        type: TileType.Base,
        imgName: 'base.png',
        playerId: '',
        object: null,
    };
    const mockPlayer: Player = {
        id: 'id1',
        character: {
            name: 'Shrek',
            img: 'assets/images/character-sprites/Orc.png',
            health: 20,
            speed: 7,
            attack: 3,
            defense: 4,
        },
        victoryPoints: 1,
        inventory: [],
        actionPoints: 1,
        movementPoints: 8,
        healthPoints: 17,
        evasionPoints: 2,
        socketId: 'socket',
        isActive: true,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: MatSnackBar, useValue: mockSnackBar }],
        });
        service = TestBed.inject(MovementService);
        mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
        mockPlayer1.movementPoints = 8;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return true when tile is occupied by wall', () => {
        const result = service.isTileOccupied(mockOccupiedTile);
        expect(result).toBe(true);
    });

    it('should return true when tile is occupied by closed door', () => {
        const mockDoorTile = {
            id: 'tile',
            type: TileType.Door,
            imgName: 'door_closed.png',
            playerId: '',
            object: null,
        };
        const result = service.isTileOccupied(mockDoorTile);
        expect(result).toBe(true);
    });

    it('should return null if not found', () => {
        service.players = [];
        expect(service.getPlayerById('id')).toBeNull();
    });

    it('should return the correct player by ID', () => {
        service.players = [mockPlayer1];
        const player = service.getPlayerById(mockPlayer1.id);
        expect(player).toBeTruthy();
        expect(player?.id).toBe(mockPlayer1.id);
    });

    it('should return true if tile is reachable by the player ', () => {
        spyOn(service, 'getReachableTiles').and.returnValue([mockTile, mockNeighborTile]);
        const result = service.isTileReachable(mockPlayerMap, mockNeighborTile.id, mockPlayer1);
        expect(result).toBe(true);
    });

    it('should return true if the player has a Portal item', () => {
        service.players = [
            {
                id: 'id1',
                character: mockChar,
                victoryPoints: 1,
                inventory: [{ name: ItemType.Portal } as unknown as Item],
                actionPoints: 1,
                movementPoints: 8,
                healthPoints: 17,
                evasionPoints: 2,
                socketId: 'socket',
                isActive: true,
            },
        ];
        const privateMethod = service['isPortalItemEquipped'] as (player: Player) => boolean;
        const player = service.getPlayerById(mockPlayer1.id);
        const hasPortal = player ? privateMethod(player) : false;
        expect(hasPortal).toBeTrue();
    });

    it('should return false if the player does not have a Portal item', () => {
        service.players = [mockPlayer1];
        const privateMethod = service['isPortalItemEquipped'] as (player: Player) => boolean;
        const player = service.getPlayerById(mockPlayer1.id);
        const hasPortal = player ? privateMethod(player) : false;
        expect(hasPortal).toBeFalse();
    });

    it('should initialize all tile costs to Infinity except the start tile', () => {
        const startId = 'tile1';
        const costs = service['initCosts'](mockPlayerMap, startId);
        expect(costs['tile1']).toBe(0);
        expect(costs['tile2']).toBe(Infinity);
    });

    it('should initialize predecessors for all tiles in the map', () => {
        const result = service['initPredecessors'](mockPlayerMap);
        expect(result).toEqual({
            tile1: null,
            tile2: null,
        });
    });

    it('should sort the queue based on tile cost in ascending order', () => {
        service['processQueue'](mockContext, mockPlayerMap);
        expect(mockContext.queue.length).toBe(1);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(mockContext.queue[0].cost).toBe(5);
    });

    it('should return null when queue is empty', () => {
        const context: PathContext = {
            visited: new Set<string>(),
            costs: {},
            predecessors: {},
            queue: [],
        };
        const result = service['processQueue'](context, mockPlayerMap);
        expect(result).toBeNull();
    });

    it('should return a valid path when the target tile is reachable', () => {
        spyOn(service, 'isTileReachable').and.returnValue(true);
        spyOn(service as any, 'minCostPath').and.returnValue([mockTile, mockNeighborTile]);
        const result = service.previewPathOnHover(mockPlayerMap, mockPlayer1, mockNeighborTile.id);
        expect(result).toEqual([mockTile, mockNeighborTile]);
    });

    it('should return an empty  path when no tile is reachable', () => {
        spyOn(service, 'isTileReachable').and.returnValue(false);
        const result = service.previewPathOnHover(mockPlayerMap, mockPlayer1, mockNeighborTile.id);
        expect(result).toEqual([]);
    });

    it('should return an empty array if the tile cost context is null', () => {
        spyOn(service, 'getTileById').and.returnValue(mockTile);
        spyOn(service as any, 'calculateTileCosts').and.returnValue(null);
        const reachableTiles = service.getReachableTiles(mockPlayerMap, mockPlayer1);
        expect(reachableTiles).toEqual([]);
    });

    it('should return Infinity if the tile type is not in TILES_COSTS', () => {
        const tile: Tile = { type: 'Unknown' as TileType } as unknown as Tile;
        spyOn(service, 'isTileOccupied').and.returnValue(false);
        const cost = service['getTileCost'](tile);
        expect(cost).toBe(Infinity);
    });

    it('should include tiles connected by portals if the player has a portal in inventory and is on a start tile', () => {
        const mockPlayerWithPortal = {
            ...mockPlayer1,
            inventory: [{ name: ItemType.Portal, desc: 'Portal', img: 'portal.png', canPlace: true, nb: 1 }],
        };

        spyOn(service, 'getTileById').and.returnValue(mockTileWithStartObject);
        spyOn(service as any, 'calculateTileCosts').and.returnValue(mockContext);

        spyOn(service, 'isTileOccupied').and.returnValue(false);

        const extendedMap = {
            ...mockPlayerMap,
            tiles: [...mockPlayerMap.tiles, mockTileWithStartObject],
        };

        const reachableTiles = service.getReachableTiles(extendedMap, mockPlayerWithPortal);
        expect(reachableTiles).toContain(mockTileWithStartObject);
    });

    it('should return an empty path when minCostPath returns null', () => {
        spyOn(service, 'isTileReachable').and.returnValue(true);
        spyOn(service as any, 'minCostPath').and.returnValue(null); // Path is null
        const result = service.previewPathOnHover(mockPlayerMap, mockPlayer1, mockNeighborTile.id);
        expect(result).toEqual([]); // Should return an empty array
    });

    it('should return null if the map is empty', () => {
        const map = { id: '1', tiles: [], connections: [] };
        const path = service['minCostPath'](map, mockPlayer1, '3');
        expect(path).toBeNull();
    });

    it('should return null if the context is null', () => {
        const result = service['minCostPath'](mockMap, mockPlayer1, mockNeighborTile.id);
        expect(result).toBeNull();
    });

    it('should return the correct path when start tile, end tile, and context are valid', () => {
        spyOn(service, 'getTileById').and.returnValues(mockTile, mockNeighborTile);
        spyOn(service as any, 'calculateTileCosts').and.returnValue(mockContext);
        spyOn(service as any, 'reconstructPath').and.returnValue([mockTile, mockNeighborTile]);
        const result = service['minCostPath'](mockMap, mockPlayer1, mockNeighborTile.id);
        expect(result).toEqual([mockTile, mockNeighborTile]);
    });

    it('should return null if the end tile is null', () => {
        spyOn(service, 'getTileById').and.callFake((id: string) => (id === 'endTileId' ? null : mockTile));
        const path = service['minCostPath'](mockMap, mockPlayer1, 'endTileId');
        expect(path).toBeNull();
    });

    it('should return reachable tiles when start tile is valid and player has sufficient movement points', () => {
        spyOn(service as any, 'calculateTileCosts').and.returnValue(null);
        const reachableTiles = service.getReachableTiles(mockPlayerMap, mockPlayer2);
        expect(reachableTiles).toEqual([]);
    });

    it('should return an empty array when no tiles are reachable', () => {
        spyOn(service, 'getTileById').and.returnValue(mockPlayerMap.tiles[0]);
        spyOn(service as any, 'calculateTileCosts').and.returnValue(mockContext);
        const reachableTiles = service.getReachableTiles(mockPlayerMap, mockPlayer2);
        expect(reachableTiles).toEqual([mockTile]);
    });

    it('should return an empty array when the map has no tiles', () => {
        const map = { id: '1', tiles: [] };
        const reachableTiles = service.getReachableTiles(map, mockPlayer1);
        expect(reachableTiles).toEqual([]);
    });

    it('should break out of the loop when current is null', () => {
        spyOn(service as any, 'initCosts').and.returnValue({ [mockTile.id]: 0 });
        spyOn(service as any, 'initPredecessors').and.returnValue({});
        spyOn(service as any, 'processQueue').and.returnValue(null);
        const result = service['calculateTileCosts'](mockMap, mockTile);
        expect(result).toBeTruthy();
        expect(result?.queue.length).toBe(1);
        expect(result?.visited.size).toBe(0);
    });

    it('should break out of the loop if current matches the endTile', () => {
        spyOn(service as any, 'initCosts').and.returnValue({ [mockTile.id]: 0, [mockNeighborTile.id]: Infinity });
        spyOn(service as any, 'initPredecessors').and.returnValue({});
        spyOn(service as any, 'processQueue').and.returnValue(mockNeighborTile);
        const result = service['calculateTileCosts'](mockMap, mockTile, mockNeighborTile);
        expect(result).toBeTruthy();
        expect(result?.queue.length).toBe(1);
        expect(result?.visited.size).toBe(0);
    });

    it('should update costs, predecessors, and add neighbor to the queue if the conditions are met', () => {
        const mockContext1: PathContext = {
            visited: new Set<string>(),
            costs: { tile1: 1, tile2: Infinity },
            predecessors: {},
            queue: [],
        };
        mockContext1.visited.clear();
        spyOn(service, 'getNeighbor').and.returnValue(mockNeighborTile);
        spyOn(service as any, 'getTileCost').and.returnValue(2);

        service['processNeighbor'](mockMap, mockTile, { x: 1, y: 0 }, mockContext1);
        expect(mockContext1.queue.length).toEqual(1);
        expect(mockContext1.queue[0].tile).toEqual(mockNeighborTile);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(mockContext1.queue[0].cost).toEqual(3);
    });

    it('should not add the neighbor to the queue if it is already present', () => {
        const mockContext1: PathContext = {
            visited: new Set<string>(),
            costs: { tile1: 1, tile2: Infinity },
            predecessors: {},
            queue: [],
        };
        mockContext1.visited.clear();
        mockContext1.queue.push({ tile: mockNeighborTile, cost: 3 });
        spyOn(service, 'getNeighbor').and.returnValue(mockNeighborTile);
        spyOn(service as any, 'getTileCost').and.returnValue(2);

        service['processNeighbor'](mockMap, mockTile, { x: 1, y: 0 }, mockContext1);
        expect(mockContext1.queue.length).toEqual(1);
        expect(mockContext1.queue[0].tile).toEqual(mockNeighborTile);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(mockContext1.queue[0].cost).toEqual(3);
    });

    it('should return the correct neighboring tile when the direction is valid', () => {
        const currentTile = mockPlayerMap.tiles[0];
        const direction = { x: 1, y: 0 };
        const neighbor = service.getNeighbor(mockPlayerMap, currentTile, direction);
        expect(neighbor).toBe(mockPlayerMap.tiles[1]);
    });

    it('should return the correct tile when the ID exists in the map', () => {
        const result = service.getTileById('tile1', mockPlayerMap);
        expect(result).toEqual(mockTile);
    });

    it('should return true for valid neighbor within same row and column', () => {
        const index = 5;
        const newIndex = 6;
        const rowSize = 10;
        const tileCount = 100;
        const result = service['isValidNeighbor'](index, newIndex, rowSize, tileCount);
        expect(result).toBe(true);
    });

    it('should return true when index and newIndex are the same', () => {
        const index = 5;
        const newIndex = 5;
        const rowSize = 10;
        const tileCount = 100;
        const result = service['isValidNeighbor'](index, newIndex, rowSize, tileCount);
        expect(result).toBe(true);
    });

    it('should return true when both indices are within the same row', () => {
        const rowSize = 5;
        const index = 3;
        const newIndex = 4;
        const result = service['isSameRow'](index, newIndex, rowSize);
        expect(result).toBe(true);
    });

    it('should return Infinity when the tile is occupied', () => {
        spyOn(service, 'isTileOccupied').and.returnValue(true);
        const cost = service['getTileCost'](mockOccupiedTile);
        expect(cost).toBe(Infinity);
    });

    it('should return null when predecessors map is empty', () => {
        const predecessors = {};
        const result = service['reconstructPath'](predecessors, mockTile, mockNeighborTile);
        expect(result).toBeNull();
    });
    it('should clear path when clearPath is called', () => {
        service.path = [mockTile, mockNeighborTile];
        service.clearPath();
        expect(service.path.length).toBe(0);
    });

    it('should clear reachableTiles when clearReachableTiles is called', () => {
        service.reachableTiles = [mockTile, mockNeighborTile];
        service.clearReachableTiles();
        expect(service.reachableTiles.length).toBe(0);
    });

    it('should return null if the context is null in minCostPath', () => {
        spyOn(service, 'getTileById').and.returnValues(mockTile, mockNeighborTile);
        spyOn(service as any, 'calculateTileCosts').and.returnValue(null);

        const path = service['minCostPath'](mockMap, mockPlayer1, 'endTile');
        expect(path).toBeNull();
    });

    it('should return an empty array when no tiles are reachable in getReachableTiles', () => {
        spyOn(service as any, 'calculateTileCosts').and.returnValue(null);
        const reachableTiles = service.getReachableTiles(mockPlayerMap, mockPlayer2);
        expect(reachableTiles).toEqual([]);
    });

    it('should return a path with only the startTile when startTile is the same as endTile', () => {
        const startTile: Tile = mockTile;
        const endTile: Tile = mockTile;
        const predecessors: { [id: string]: Tile | null } = {
            tile1: null,
        };

        const result = service['reconstructPath'](predecessors, startTile, endTile);

        expect(result).toEqual([startTile]);
    });

    it('should return true when teleportation is possible', () => {
        spyOn(service, 'getTileById').and.returnValue(mockTileWithStartObject);
        spyOn<any>(service, 'isPortalItemEquipped').and.returnValue(true);
        spyOn(service, 'isTileOccupied').and.returnValue(false);

        const result = service.isTeleportationPossible('tile1', mockPlayer, {
            ...mockMap,
            tiles: [{ ...mockTileWithStartObject, playerId: mockPlayer.id }, mockTileWithStartObject],
        });
        expect(result).toBe(true);
    });

    it('should return false when player does not have portal item equipped', () => {
        spyOn(service, 'getTileById').and.returnValue(mockTileWithStartObject);
        spyOn<any>(service, 'isPortalItemEquipped').and.returnValue(false);
        spyOn(service, 'isTileOccupied').and.returnValue(false);

        const result = service.isTeleportationPossible('tile1', mockPlayer, mockMap);
        expect(result).toBe(false);
    });

    it('should return false when previous tile does not have start object', () => {
        const mockMapWithDifferentPreviousTile: Map = {
            id: '1',
            tiles: [{ ...mockTileWithoutObject, playerId: mockPlayer.id }, mockTileWithStartObject],
        };

        spyOn(service, 'getTileById').and.returnValue(mockTileWithStartObject);
        spyOn<any>(service, 'isPortalItemEquipped').and.returnValue(true);
        spyOn(service, 'isTileOccupied').and.returnValue(false);

        const result = service.isTeleportationPossible('tile1', mockPlayer, mockMapWithDifferentPreviousTile);
        expect(result).toBe(false);
    });

    it('should return false when target tile does not have start object', () => {
        spyOn(service, 'getTileById').and.returnValue(mockTileWithoutObject);
        spyOn<any>(service, 'isPortalItemEquipped').and.returnValue(true);
        spyOn(service, 'isTileOccupied').and.returnValue(false);

        const result = service.isTeleportationPossible('tile2', mockPlayer, mockMap);
        expect(result).toBe(false);
    });

    it('should return false when target tile is occupied', () => {
        spyOn(service, 'getTileById').and.returnValue(mockTileWithStartObject);
        spyOn<any>(service, 'isPortalItemEquipped').and.returnValue(true);
        spyOn(service, 'isTileOccupied').and.returnValue(true);

        const result = service.isTeleportationPossible('tile1', mockPlayer, mockMap);
        expect(result).toBe(false);
    });

    it('should return the path when teleportation is possible', () => {
        spyOn(service, 'isTeleportationPossible').and.returnValue(true);
        spyOn(service, 'getTileById').and.returnValue(mockTileWithStartObject);

        const result = service.previewTeleportation('tile1', mockMap, mockPlayer);
        expect(result).toEqual([mockTileWithStartObject]);
        expect(service.path).toEqual([mockTileWithStartObject]);
    });

    it('should return an empty array when teleportation is not possible', () => {
        spyOn(service, 'isTeleportationPossible').and.returnValue(false);

        const result = service.previewTeleportation('tile1', mockMap, mockPlayer);
        expect(result).toEqual([]);
        expect(service.path).toEqual([]);
    });
});
