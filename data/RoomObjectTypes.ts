export interface RoomObjectType {
    modelUrl: string,
    forSurface: string, // 'floor', 'wall', 'ceiling'
    width: number, // in grid squares
    length: number, // in grid squares
    uses?: string[],
}

export const RoomObjectTypes: { [id: string]: RoomObjectType } = {
    PottedPlant: {
        modelUrl: '/pottedPlant.glb',
        forSurface: 'floor',
        width: 1,
        length: 1
    },
    FloorLamp: {
        modelUrl: '/lampRoundFloor.glb',
        forSurface: 'floor',
        width: 1,
        length: 1
    },
    LoungeChair: {
        modelUrl: '/loungeChair.glb',
        forSurface: 'floor',
        width: 1,
        length: 1
    },
    LCDTelevision: {
        modelUrl: '/televisionOnCabinet.glb',
        forSurface: 'floor',
        width: 2,
        length: 1
    },
}