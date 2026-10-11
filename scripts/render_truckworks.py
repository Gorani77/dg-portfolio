"""Create portfolio artwork from the actual TruckWorks GLBs. Not an app screenshot/test.
Blender --background --python render_truckworks.py -- <TruckWorks root> <output directory>
"""
import sys
from pathlib import Path
import bpy
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:]
root=Path(args[0])
output=Path(args[1])
output.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=32
scene.cycles.use_denoising=True
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.film_transparent=False
scene.world=bpy.data.worlds.new('EditorialWorld')
scene.world.color=(.12,.12,.12)
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.18,.23,.3,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.45
scene.view_settings.view_transform='AgX'

def asset(name,p=(0,0,0)):
    before=set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(root/'frontend'/'public'/'models'/name/(name+'.glb')))
    objects=set(bpy.data.objects)-before
    for obj in objects:
        if obj.parent not in objects:
            obj.location+=Vector((p[0],-p[2],p[1]))
    return objects

def light(name,pos,power,size,color):
    data=bpy.data.lights.new(name,'AREA')
    data.energy=power
    data.shape='DISK'
    data.size=size
    data.color=color
    obj=bpy.data.objects.new(name,data)
    scene.collection.objects.link(obj)
    obj.location=pos
    obj.rotation_euler=(Vector((0,2,0))-obj.location).to_track_quat('-Z','Y').to_euler()

def camera(pos,target,scale):
    obj=bpy.data.objects.new('EditorialCamera',bpy.data.cameras.new('EditorialCamera'))
    scene.collection.objects.link(obj)
    obj.location=pos
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
    obj.data.type='ORTHO'
    obj.data.ortho_scale=scale
    obj.data.lens=50
    scene.camera=obj

asset('factory-hall')
asset('storage-racks',(-9,0,-10))
asset('assembly-display',(7,0,-10))
asset('line-deck')
for i,name in enumerate(['input-feeder','forming-cell','drilling-station','inspection-gate','sorting-storage']):
    x=(i-2)*4.4
    asset(name,(x,0,0))
    asset('station-plinth',(x,0,0))
    if i>0:
        asset('queue-pallet',(x,0,1.4))
    if i<4:
        asset('roller-conveyor',(x+2.2,0,0))
# Neutral product poses are editorial staging, not a production snapshot.
asset('chassis-raw',(-8.8,.97,.45))
asset('chassis-formed',(-4.4,.97,.45))
asset('chassis-drilled',(0,.97,.45))
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.72))
plane=bpy.context.object
mat=bpy.data.materials.new('EditorialGround')
mat.diffuse_color=(.014,.022,.029,1)
mat.use_nodes=True
mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.014,.022,.029,1)
mat.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.78
plane.data.materials.append(mat)
light('Key',(0,-8,23),6500,15,(.85,.94,1))
light('WarmRim',(-17,12,14),4700,12,(1,.76,.42))
light('CoolRim',(18,14,19),6000,14,(.55,.79,1))
camera((28,-35,32),(0,3.7,.5),46)
scene.render.resolution_x=2200
scene.render.resolution_y=1400
scene.render.filepath=str(output/'factory-overview.png')
bpy.ops.render.render(write_still=True)
print('AUTHORED factory-overview.png (editorial artwork, not live app capture)')
camera((3,-10,7),(-4.4,0,1),10.8)
scene.render.resolution_x=1600
scene.render.resolution_y=1200
scene.render.filepath=str(output/'forming-detail.png')
bpy.ops.render.render(write_still=True)
print('AUTHORED forming-detail.png (editorial artwork, not live app capture)')

