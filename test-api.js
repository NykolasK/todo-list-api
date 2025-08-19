const API_BASE = 'http://localhost:3000';

async function testAPI() {
    try {
        console.log('🧪 Iniciando testes da API...\n');

        console.log('1. Testando endpoint principal...');
        const mainResponse = await fetch(API_BASE);
        const mainData = await mainResponse.json();
        console.log('✅ Resposta:', JSON.stringify(mainData, null, 2));
        console.log('\n' + '='.repeat(50) + '\n');

        console.log('2. Criando novo todo...');
        const createResponse = await fetch(`${API_BASE}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: 'Minha primeira tarefa',
                description: 'Testar a API Todo'
            })
        });
        const createData = await createResponse.json();
        console.log('✅ Todo criado:', JSON.stringify(createData, null, 2));
        console.log('\n' + '='.repeat(50) + '\n');

        console.log('3. Listando todos...');
        const listResponse = await fetch(`${API_BASE}/todos`);
        const listData = await listResponse.json();
        console.log('✅ Lista de todos:', JSON.stringify(listData, null, 2));
        console.log('\n' + '='.repeat(50) + '\n');

        console.log('4. Marcando todo como completo...');
        const updateResponse = await fetch(`${API_BASE}/todos/1`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                completed: true
            })
        });
        const updateData = await updateResponse.json();
        console.log('✅ Todo atualizado:', JSON.stringify(updateData, null, 2));
        console.log('\n' + '='.repeat(50) + '\n');

        console.log('5. Buscando todo específico...');
        const getResponse = await fetch(`${API_BASE}/todos/1`);
        const getData = await getResponse.json();
        console.log('✅ Todo encontrado:', JSON.stringify(getData, null, 2));

        console.log('\n🎉 Todos os testes concluídos com sucesso!');

    } catch (error) {
        console.error('❌ Erro durante os testes:', error.message);
        console.log('Certifique-se de que o servidor está rodando em http://localhost:3000');
    }
}

testAPI();
